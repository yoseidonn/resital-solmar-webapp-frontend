import React, { useEffect, useState } from 'react';
import { getAPISReportFiles } from '../services/apisReportFileService';
import { getResortReportFiles } from '../services/resortReportFileService';
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
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

const mockPreviewData = {
  columns: ['Column 1', 'Column 2', 'Column 3'],
  rows: [
    ['Value 1', 'Value 2', 'Value 3'],
    ['Value 4', 'Value 5', 'Value 6'],
  ],
};

const OutputHistory: React.FC = () => {
  const [apisFiles, setApisFiles] = useState<any[]>([]);
  const [resortFiles, setResortFiles] = useState<any[]>([]);
  const [apisOutputs, setApisOutputs] = useState<any[]>([]);
  const [resortOutputs, setResortOutputs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'APIS' | 'Resort'>('APIS');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewOutput, setPreviewOutput] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [outputToDelete, setOutputToDelete] = useState<{output: any, type: 'APIS' | 'Resort'} | null>(null);

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

  const handlePreview = (output: any) => {
    setPreviewOutput(output);
    setPreviewData(mockPreviewData); // Replace with real preview fetch if available
    setShowPreview(true);
  };

  const handleDelete = (output: any, type: 'APIS' | 'Resort') => {
    if (type === 'APIS') {
      setApisOutputs(apisOutputs.filter(o => o.id !== output.id));
    } else {
      setResortOutputs(resortOutputs.filter(o => o.id !== output.id));
    }
    setShowDeleteConfirm(false);
    setOutputToDelete(null);
  };

  const handleDeleteAttempt = (output: any, type: 'APIS' | 'Resort') => {
    setOutputToDelete({ output, type });
    setShowDeleteConfirm(true);
  };

  const renderOutputCard = (output: any, files: any[], type: 'APIS' | 'Resort') => {
    const relatedFile = type === 'APIS'
      ? files.find(f => f.id === output.apis_report_file)
      : files.find(f => f.id === output.resort_report_file);
    return (
      <Col key={output.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
        <div className="card h-100">
          <div className="card-body d-flex flex-column">
            <h6 className="card-title">#{output.id}</h6>
            <div className="mb-2">
              <span className="fw-bold small">Generated at: </span>
              <span className="text-muted small">{formatDate(output.created_at)}</span>
            </div>
            <div className="mb-2">
              <span className="fw-bold small">Used File: </span>
              <span
                className="badge bg-info text-dark"
                style={{
                  maxWidth: '140px',
                  minWidth: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                }}
                title={relatedFile ? (relatedFile.file || relatedFile.name) : 'Unknown'}
              >
                {relatedFile ? (relatedFile.file || relatedFile.name) : 'Unknown'}
              </span>
            </div>
            <div className="mb-2 d-flex gap-2 flex-wrap">
              <Button size="sm" variant="info" onClick={() => handlePreview(output)}>View</Button>
              <Button size="sm" variant="danger" onClick={() => handleDeleteAttempt(output, type)}>Delete</Button>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Output History</h2>
      <Nav variant="tabs" activeKey={activeTab} onSelect={k => setActiveTab(k as 'APIS' | 'Resort')} className="mb-4">
        <Nav.Item>
          <Nav.Link eventKey="APIS">APIS Report Outputs</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Resort">Resort Report Outputs</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading ? <div>Loading...</div> : (
        <Row>
          {activeTab === 'APIS'
            ? apisOutputs.map(o => renderOutputCard(o, apisFiles, 'APIS'))
            : resortOutputs.map(o => renderOutputCard(o, resortFiles, 'Resort'))}
        </Row>
      )}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Output Preview: {previewOutput && (previewOutput.fileName || previewOutput.file_path || previewOutput.content?.summary || previewOutput.id)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewData && previewOutput && typeof previewOutput === 'object' ? (
            <React.Fragment>
              {Array.isArray(previewOutput.rows) && previewOutput.rows.length > 0 && (
                <div className="table-responsive mb-3">
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        {Object.keys((previewOutput.rows && Array.isArray(previewOutput.rows) && previewOutput.rows[0]) || {}).map((col, idx) => <th key={idx}>{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {previewOutput.rows.map((row: any, idx: number) => (
                        <tr key={idx}>{Object.values(row).map((cell, cidx) => <td key={cidx}>{String(cell)}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {previewOutput.messages && typeof previewOutput.messages === 'object' && !Array.isArray(previewOutput.messages) ? (
                <div>
                  <h6>Messages</h6>
                  <ul>
                    {Object.entries(previewOutput.messages).map(([user, msg]) => (
                      <li key={user}><strong>{user}:</strong> {String(msg)}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </React.Fragment>
          ) : <div>No preview available.</div>}
        </Modal.Body>
      </Modal>
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this output: {outputToDelete?.output?.fileName || outputToDelete?.output?.file_path || outputToDelete?.output?.content?.summary || outputToDelete?.output?.id}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => outputToDelete && handleDelete(outputToDelete.output, outputToDelete.type)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OutputHistory; 