import React, { useEffect, useState } from 'react';
import { getAPISReportFiles, downloadAPISReportFile } from '../services/apisReportFileService';
import { getResortReportFiles, downloadResortReportFile } from '../services/resortReportFileService';
import { getAPISReportOutputs } from '../services/apisReportOutputService';
import { getResortReportOutputs } from '../services/resortReportOutputService';
import { Button, Modal, Row, Col, Nav, Alert } from 'react-bootstrap';
import BadgeRow from '../components/BadgeRow';

function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

const mockPreviewData = {
  columns: ['Column 1', 'Column 2', 'Column 3'],
  rows: [
    ['Value 1', 'Value 2', 'Value 3'],
    ['Value 4', 'Value 5', 'Value 6'],
  ],
};

const FileHistory: React.FC = () => {
  const [apisFiles, setApisFiles] = useState<any[]>([]);
  const [resortFiles, setResortFiles] = useState<any[]>([]);
  const [apisOutputs, setApisOutputs] = useState<any[]>([]);
  const [resortOutputs, setResortOutputs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'APIS' | 'Resort'>('APIS');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{file: any, type: 'APIS' | 'Resort', canDelete: boolean} | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [af, rf, ao, ro] = await Promise.all([
        getAPISReportFiles(),
        getResortReportFiles(),
        getAPISReportOutputs(),
        getResortReportOutputs(),
      ]);
      setApisFiles(af);
      setResortFiles(rf);
      setApisOutputs(ao);
      setResortOutputs(ro);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handlePreview = (file: any) => {
    setPreviewFile(file);
    setPreviewData(mockPreviewData); // Replace with real preview fetch if available
    setShowPreview(true);
  };

  const handleDelete = (file: any, type: 'APIS' | 'Resort') => {
    if (type === 'APIS') {
      setApisFiles(apisFiles.filter(f => f.id !== file.id));
      setApisOutputs(apisOutputs.filter(o => o.apis_report_file !== file.id));
    } else {
      setResortFiles(resortFiles.filter(f => f.id !== file.id));
      setResortOutputs(resortOutputs.filter(o => o.resort_report_file !== file.id));
    }
    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };

  const handleDeleteAttempt = (file: any, type: 'APIS' | 'Resort', canDelete: boolean) => {
    if (!canDelete) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setFileToDelete({ file, type, canDelete });
    setShowDeleteConfirm(true);
  };

  const renderFileCard = (file: any, outputs: any[], type: 'APIS' | 'Resort') => {
    const relatedOutputs = outputs.filter(o => (type === 'APIS' ? o.apis_report_file : o.resort_report_file) === file.id);
    const canDelete = relatedOutputs.length === 0;
    return (
      <Col key={file.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
        <div className="card h-100">
          <div className="card-body d-flex flex-column">
            <h6 className="card-title">{file.file || file.name}</h6>
            <div className="mb-2 text-muted small">{formatDate(file.uploaded_at || file.date)}</div>
            <div className="mb-2 d-flex gap-2 flex-wrap">
              <Button size="sm" variant="info" onClick={() => handlePreview(file)}>View</Button>
              <Button size="sm" variant="secondary" onClick={() => (type === 'APIS' ? downloadAPISReportFile(file.id) : downloadResortReportFile(file.id))}>Download</Button>
              <Button size="sm" variant="danger" onClick={() => handleDeleteAttempt(file, type, canDelete)}>Delete</Button>
            </div>
            <div className="">
              {relatedOutputs.length > 0 && (
                <>
                  <div className="fw-bold small">Related Outputs:</div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {relatedOutputs.map(o => (
                      <BadgeRow key={o.id}>
                        <span className="badge bg-info text-dark">
                          {new Date(o.created_at).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: '2-digit'})} - #{o.id}
                        </span>
                      </BadgeRow>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <div className="container py-4">
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible className="mb-3">
          Cannot delete file - please remove associated outputs first
        </Alert>
      )}
      <h2 className="mb-4">File History</h2>
      <Nav variant="tabs" activeKey={activeTab} onSelect={k => setActiveTab(k as 'APIS' | 'Resort')} className="mb-4">
        <Nav.Item>
          <Nav.Link eventKey="APIS">APIS Report Files</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Resort">Resort Report Files</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading ? <div>Loading...</div> : (
        <Row>
          {activeTab === 'APIS'
            ? apisFiles.map(f => renderFileCard(f, apisOutputs, 'APIS'))
            : resortFiles.map(f => renderFileCard(f, resortOutputs, 'Resort'))}
        </Row>
      )}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>File Preview: {previewFile?.file || previewFile?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewData ? (
            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    {previewData.columns.map((col: string, idx: number) => <th key={idx}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row: string[], idx: number) => (
                    <tr key={idx}>{row.map((cell, cidx) => <td key={cidx}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div>No preview available.</div>}
        </Modal.Body>
      </Modal>
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this file: {fileToDelete?.file?.file || fileToDelete?.file?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => fileToDelete && handleDelete(fileToDelete.file, fileToDelete.type)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FileHistory;