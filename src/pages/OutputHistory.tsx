import React, { useEffect, useState } from 'react';
import { getAPISReportFiles } from '../services/apisReportFileService';
import { getResortReportFiles } from '../services/resortReportFileService';
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
  const [apisOutputs, setApisOutputs] = useState<APISReportOutput[]>([]);
  const [resortOutputs, setResortOutputs] = useState<any[]>([]);
  const [extrasOutputs, setExtrasOutputs] = useState<ExtrasFilteredReservationOutput[]>([]);
  const [caretakerOutputs, setCaretakerOutputs] = useState<CaretakerExtrasViewOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'APIS' | 'Extras' | 'Caretaker'>('APIS');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewOutput, setPreviewOutput] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [outputToDelete, setOutputToDelete] = useState<{output: any, type: 'APIS' | 'Resort' | 'Extras' | 'Caretaker'} | null>(null);

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

  const handlePreview = (output: any) => {
    setPreviewOutput(output);
    setPreviewData(mockPreviewData); // Replace with real preview fetch if available
    setShowPreview(true);
  };

  const handleDelete = (output: any, type: 'APIS' | 'Resort' | 'Extras' | 'Caretaker') => {
    if (type === 'APIS') {
      setApisOutputs(apisOutputs.filter(o => o.id !== output.id));
    } else if (type === 'Resort') {
      setResortOutputs(resortOutputs.filter(o => o.id !== output.id));
    } else if (type === 'Extras') {
      setExtrasOutputs(extrasOutputs.filter(o => o.id !== output.id));
    } else if (type === 'Caretaker') {
      setCaretakerOutputs(caretakerOutputs.filter(o => o.id !== output.id));
    }
    setShowDeleteConfirm(false);
    setOutputToDelete(null);
  };

  const handleDeleteAttempt = (output: any, type: 'APIS' | 'Resort' | 'Extras' | 'Caretaker') => {
    setOutputToDelete({ output, type });
    setShowDeleteConfirm(true);
  };

  const renderAPISOutputCard = (output: APISReportOutput) => (
    <Col key={output.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <h6 className="card-title">#{output.id}</h6>
          <div className="mb-2">
            <span className="fw-bold small">Generated at: </span>
            <span className="text-muted small">{formatDate(output.created_at)}</span>
          </div>
          <div className="mb-2 d-flex gap-2 flex-wrap">
            <Button size="sm" variant="info" onClick={() => setPreviewOutput({ type: 'APIS', data: output })}>Preview</Button>
            <Button size="sm" variant="success" onClick={() => downloadAPISReportExcel(output)}>Excel</Button>
            <Button size="sm" variant="secondary" onClick={() => downloadAPISReportJSON(output)}>JSON</Button>
          </div>
        </div>
      </div>
    </Col>
  );

  const renderExtrasOutputCard = (output: ExtrasFilteredReservationOutput) => (
    <Col key={output.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <h6 className="card-title">#{output.id}</h6>
          <div className="mb-2">
            <span className="fw-bold small">Generated at: </span>
            <span className="text-muted small">{formatDate(output.created_at)}</span>
          </div>
          <div className="mb-2 d-flex gap-2 flex-wrap">
            <Button size="sm" variant="info" onClick={() => setPreviewOutput({ type: 'Extras', data: output })}>Preview</Button>
            <Button size="sm" variant="success" onClick={() => downloadExtrasFilteredReservationExcel(output)}>Excel</Button>
            <Button size="sm" variant="secondary" onClick={() => downloadExtrasFilteredReservationJSON(output)}>JSON</Button>
          </div>
        </div>
      </div>
    </Col>
  );

  const renderCaretakerOutputCard = (output: CaretakerExtrasViewOutput) => (
    <Col key={output.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <h6 className="card-title">#{output.id}</h6>
          <div className="mb-2">
            <span className="fw-bold small">Generated at: </span>
            <span className="text-muted small">{formatDate(output.created_at)}</span>
          </div>
          <div className="mb-2 d-flex gap-2 flex-wrap">
            <Button size="sm" variant="info" onClick={() => setPreviewOutput({ type: 'Caretaker', data: output })}>Preview</Button>
            <Button size="sm" variant="success" onClick={() => downloadCaretakerExtrasViewExcel(output)}>Excel</Button>
            <Button size="sm" variant="secondary" onClick={() => downloadCaretakerExtrasViewJSON(output)}>JSON</Button>
            <Button size="sm" variant="dark" onClick={async () => {
              const text = await downloadCaretakerExtrasViewText(output);
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${output.fileName || output.id}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}>Text</Button>
          </div>
        </div>
      </div>
    </Col>
  );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Output History</h2>
      <Nav variant="tabs" activeKey={activeTab} onSelect={k => setActiveTab(k as any)} className="mb-4">
        <Nav.Item>
          <Nav.Link eventKey="APIS">APIS Report Outputs</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Extras">Extras Filtered Reservation Outputs</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="Caretaker">Caretaker Extras View Outputs</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading ? <div>Loading...</div> : (
        <Row>
          {activeTab === 'APIS' && Array.isArray(apisOutputs) && apisOutputs.map(renderAPISOutputCard)}
          {activeTab === 'Extras' && Array.isArray(extrasOutputs) && extrasOutputs.map(renderExtrasOutputCard)}
          {activeTab === 'Caretaker' && Array.isArray(caretakerOutputs) && caretakerOutputs.map(renderCaretakerOutputCard)}
        </Row>
      )}
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