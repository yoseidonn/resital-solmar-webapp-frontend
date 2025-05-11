import React, { useRef, useState } from 'react';
import { Container, Row, Col, Button, Form, Alert, Modal } from 'react-bootstrap';

const BackupRecovery: React.FC = () => {
  const [restoreType, setRestoreType] = useState<'files' | 'database' | ''>('');
  const [mode, setMode] = useState<'merge' | 'reset'>('merge');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = (type: 'files' | 'database') => {
    const url = type === 'files' ? '/api/backup/files' : '/api/backup/database';
    window.open(url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleRestore = () => {
    setShowConfirm(true);
  };

  const doRestore = async () => {
    if (!file || !restoreType) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    const endpoint = restoreType === 'files' ? '/api/restore/files' : '/api/restore/database';
    const res = await fetch(endpoint, { method: 'POST', body: formData });
    if (res.ok) {
      setMessage('Restore successful!');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setMessage('Restore failed: ' + (await res.text()));
    }
    setShowConfirm(false);
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Backup & Recovery</h2>
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <h5>Backup</h5>
          <Button variant="outline-primary" className="me-2 mb-2" onClick={() => handleDownload('files')}>
            Download Excel Files (zip)
          </Button>
          <Button variant="outline-secondary" className="mb-2" onClick={() => handleDownload('database')}>
            Download Database
          </Button>
        </Col>
        <Col md={6}>
          <h5>Restore</h5>
          <Form.Group className="mb-2">
            <Form.Label>Restore Type</Form.Label>
            <Form.Select value={restoreType} onChange={e => setRestoreType(e.target.value as 'files' | 'database')}>
              <option value="">Select...</option>
              <option value="files">Excel Files (zip)</option>
              <option value="database">Database (sqlite)</option>
            </Form.Select>
          </Form.Group>
          {restoreType && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Upload {restoreType === 'files' ? 'Excel Zip' : 'Database File'}</Form.Label>
                <Form.Control type="file" ref={fileInputRef} onChange={handleFileChange} accept={restoreType === 'files' ? '.zip' : '.sqlite,.db'} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Restore Mode</Form.Label>
                <Form.Check
                  type="radio"
                  label="Merge (add to existing)"
                  name="mode"
                  checked={mode === 'merge'}
                  onChange={() => setMode('merge')}
                />
                <Form.Check
                  type="radio"
                  label="Reset (overwrite all)"
                  name="mode"
                  checked={mode === 'reset'}
                  onChange={() => setMode('reset')}
                />
              </Form.Group>
              <Button variant="success" onClick={handleRestore} disabled={!file}>Restore</Button>
            </>
          )}
        </Col>
      </Row>
      {message && <Alert className="mt-3" variant={message.includes('failed') ? 'danger' : 'success'}>{message}</Alert>}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Restore</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {mode === 'merge' ? 'merge' : 'reset and overwrite'} {restoreType === 'files' ? 'Excel files' : 'the database'}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={doRestore}>Yes, Restore</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BackupRecovery; 