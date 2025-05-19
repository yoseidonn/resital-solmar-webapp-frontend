import React, { useEffect, useState } from 'react';
import { getAPISReportFiles, downloadAPISReportFile } from '../services/apisReportFileService';
import { getResortReportFiles, downloadResortReportFile } from '../services/resortReportFileService';
import { getAPISReportOutputs, downloadAPISReportExcel, downloadAPISReportJSON } from '../services/apisReportOutputService';
import { getExtrasFilteredReservationOutputs, downloadExtrasFilteredReservationExcel, downloadExtrasFilteredReservationJSON } from '../services/extrasFilteredReservationOutputService';
import { getCaretakerExtrasViewOutputs, downloadCaretakerExtrasViewExcel, downloadCaretakerExtrasViewJSON, downloadCaretakerExtrasViewText } from '../services/caretakerExtrasViewOutputService';
import type { APISReportOutput, ExtrasFilteredReservationOutput, CaretakerExtrasViewOutput } from '../services/models';
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
  const [apisOutputs, setApisOutputs] = useState<APISReportOutput[]>([]);
  const [extrasOutputs, setExtrasOutputs] = useState<ExtrasFilteredReservationOutput[]>([]);
  const [caretakerOutputs, setCaretakerOutputs] = useState<CaretakerExtrasViewOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'APIS' | 'Resort'>('APIS');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [showError, setShowError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{file: any, type: 'APIS' | 'Resort', canDelete: boolean} | null>(null);
  const [previewOutput, setPreviewOutput] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [af, rf, ao, eo, co] = await Promise.all([
        getAPISReportFiles(),
        getResortReportFiles(),
        getAPISReportOutputs(),
        getExtrasFilteredReservationOutputs(),
        getCaretakerExtrasViewOutputs(),
      ]);
      setApisFiles(af);
      setResortFiles(rf);
      setApisOutputs(ao);
      setExtrasOutputs(eo);
      setCaretakerOutputs(co);
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

  const renderOutputBadge = (output: any, type: 'APIS' | 'Extras' | 'Caretaker') => (
    <BadgeRow key={output.id}>
      <span className="badge bg-info text-dark">
        {new Date(output.created_at).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: '2-digit'})} - #{output.id}
      </span>
      <Button size="sm" variant="info" className="ms-2" onClick={() => setPreviewOutput({ type, data: output })}>Preview</Button>
      <Button size="sm" variant="danger" className="ms-1" onClick={() => handleDeleteOutput(output, type)}>Delete</Button>
    </BadgeRow>
  );

  const handleDeleteOutput = (output: any, type: 'APIS' | 'Extras' | 'Caretaker') => {
    if (type === 'APIS') setApisOutputs(apisOutputs.filter(o => o.id !== output.id));
    if (type === 'Extras') setExtrasOutputs(extrasOutputs.filter(o => o.id !== output.id));
    if (type === 'Caretaker') setCaretakerOutputs(caretakerOutputs.filter(o => o.id !== output.id));
  };

  const renderFileCard = (file: any, type: 'APIS' | 'Resort') => {
    let relatedAPIS = [] as APISReportOutput[];
    let relatedExtras = [] as ExtrasFilteredReservationOutput[];
    let relatedCaretaker = [] as CaretakerExtrasViewOutput[];
    if (type === 'APIS') {
      relatedAPIS = apisOutputs.filter(o => o.apis_report_file === file.id);
    } else {
      relatedExtras = extrasOutputs.filter(o => o.resort_report_file === file.id);
      relatedCaretaker = caretakerOutputs.filter(o => o.resort_report_file === file.id);
    }
    const canDelete = relatedAPIS.length === 0 && relatedExtras.length === 0 && relatedCaretaker.length === 0;
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
              {type === 'APIS' && relatedAPIS.length > 0 && (
                <>
                  <div className="fw-bold small">Related Outputs:</div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {relatedAPIS.map(o => renderOutputBadge(o, 'APIS'))}
                  </div>
                </>
              )}
              {type === 'Resort' && (relatedExtras.length > 0 || relatedCaretaker.length > 0) && (
                <>
                  <div className="fw-bold small">Related Outputs:</div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {relatedExtras.map(o => renderOutputBadge(o, 'Extras'))}
                    {relatedCaretaker.map(o => renderOutputBadge(o, 'Caretaker'))}
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
            ? apisFiles.map(f => renderFileCard(f, 'APIS'))
            : resortFiles.map(f => renderFileCard(f, 'Resort'))}
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
      <Modal show={!!previewOutput} onHide={() => setPreviewOutput(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Output Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewOutput?.type === 'APIS' && (
            <div className="table-responsive mb-3">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    {previewOutput.data.rows && previewOutput.data.rows.length > 0 && Object.keys(previewOutput.data.rows[0]).map((col, idx) => <th key={idx}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {previewOutput.data.rows && previewOutput.data.rows.map((row: any, idx: number) => (
                    <tr key={idx}>{Object.values(row).map((cell, cidx) => <td key={cidx}>{String(cell)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {previewOutput?.type === 'Extras' && (
            <div className="table-responsive mb-3">
              {previewOutput.data.grouped_reservations && Object.entries(previewOutput.data.grouped_reservations).map(([villa, reservations], idx) => (
                <div key={villa} className="mb-3">
                  <h6>{villa}</h6>
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        {(Array.isArray(reservations) && reservations.length > 0) && Object.keys(reservations[0]).map((col, idx) => <th key={idx}>{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(reservations) && reservations.map((row, idx) => (
                        <tr key={idx}>{Object.values(row).map((cell, cidx) => <td key={cidx}>{String(cell)}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          {previewOutput?.type === 'Caretaker' && (
            <div className="accordion" id="caretakerAccordion">
              {previewOutput.data.content && Object.entries(previewOutput.data.content).map(([caretaker, text], idx) => (
                <div className="accordion-item" key={caretaker}>
                  <h2 className="accordion-header" id={`heading${idx}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${idx}`} aria-expanded="false" aria-controls={`collapse${idx}`}>{caretaker}</button>
                  </h2>
                  <div id={`collapse${idx}`} className="accordion-collapse collapse" aria-labelledby={`heading${idx}`} data-bs-parent="#caretakerAccordion">
                    <div className="accordion-body">
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{String(text)}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FileHistory; 