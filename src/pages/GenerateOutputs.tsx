import React, { useEffect, useState } from 'react';
import { getAPISReportFiles } from '../services/apisReportFileService';
import { getResortReportFiles } from '../services/resortReportFileService';
import { getCareTakers } from '../services/careTakerService';
import { getVillas } from '../services/villaService';
import { generateAPISReportOutput } from '../services/apisReportOutputService';
import { getExtrasFilteredReservationOutputs, generateExtrasFilteredReservationOutput } from '../services/extrasFilteredReservationOutputService';
import { getCaretakerExtrasViewOutputs, generateCaretakerExtrasViewOutput } from '../services/caretakerExtrasViewOutputService';
import { Button, Form, Nav, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';

const defaultHeaders = [
  'accomodation_name',
  'opportunity_name',
  'holiday_start_date',
  'holiday_end_date',
  'extras_aggregated',
];

const GenerateOutputs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'APIS' | 'Extras' | 'Caretaker'>('APIS');
  const [loading, setLoading] = useState(true);
  const [apisFiles, setApisFiles] = useState<any[]>([]);
  const [resortFiles, setResortFiles] = useState<any[]>([]);
  const [caretakers, setCaretakers] = useState<any[]>([]);
  const [villas, setVillas] = useState<any[]>([]);
  // APIS
  const [apisFileId, setApisFileId] = useState<string | number>('');
  const [apisHeaders, setApisHeaders] = useState<string[]>(defaultHeaders);
  const [apisOpportunity, setApisOpportunity] = useState('');
  // Extras
  const [extrasFileId, setExtrasFileId] = useState<string | number>('');
  const [extrasHeaders, setExtrasHeaders] = useState<string[]>(defaultHeaders);
  const [extrasFilters, setExtrasFilters] = useState<Record<string, string[]>>({});
  // Caretaker
  const [caretakerFileId, setCaretakerFileId] = useState<string | number>('');
  const [selectedCaretakers, setSelectedCaretakers] = useState<any[]>([]);
  const [caretakerHeaders, setCaretakerHeaders] = useState<string[]>(defaultHeaders);
  // Feedback
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Extras
  const [extrasVillaEntries, setExtrasVillaEntries] = useState<any[]>([]);
  // Caretaker
  const [caretakerVillaEntries, setCaretakerVillaEntries] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [af, rf, cs, vs] = await Promise.all([
        getAPISReportFiles(),
        getResortReportFiles(),
        getCareTakers(),
        getVillas(),
      ]);
      setApisFiles(af);
      setResortFiles(rf);
      setCaretakers(cs);
      setVillas(vs);
      setLoading(false);
    }
    fetchData();
  }, []);

  // --- APIS Output Tab ---
  const handleGenerateAPIS = async () => {
    setSubmitting(true); setSuccess(null); setError(null);
    try {
      await generateAPISReportOutput(apisFileId, {
        opportunity_name: apisOpportunity,
        headers: apisHeaders,
      });
      setSuccess('APIS Report Output generated successfully!');
    } catch (e: any) {
      setError('Failed to generate APIS Report Output.');
    }
    setSubmitting(false);
  };

  // --- Extras Filtered Output Tab ---
  const handleExtrasFilterChange = (villaId: string | number, extra: string) => {
    setExtrasFilters(prev => {
      const current = prev[villaId] || [];
      return {
        ...prev,
        [villaId]: current.includes(extra) ? current.filter(e => e !== extra) : [...current, extra],
      };
    });
  };
  const handleGenerateExtras = async () => {
    setSubmitting(true); setSuccess(null); setError(null);
    try {
      await generateExtrasFilteredReservationOutput(extrasFileId, {
        filters: extrasFilters,
        headers: extrasHeaders,
        individual_villa_entries: extrasVillaEntries,
      });
      setSuccess('Extras Filtered Reservation Output generated successfully!');
    } catch (e: any) {
      setError('Failed to generate Extras Filtered Reservation Output.');
    }
    setSubmitting(false);
  };

  // --- Caretaker Extras View Output Tab ---
  const handleCaretakerSelect = (id: number) => {
    setSelectedCaretakers(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
  };
  const handleGenerateCaretaker = async () => {
    setSubmitting(true); setSuccess(null); setError(null);
    try {
      const selected = caretakers.filter(c => selectedCaretakers.includes(c.id)).map(c => ({
        id: c.id,
        name: c.name,
        phone_number: c.phone_number,
        assigned_villas: c.assigned_villas,
      }));
      await generateCaretakerExtrasViewOutput(caretakerFileId, {
        selected_users: selected,
        headers: caretakerHeaders,
        individual_villa_entries: caretakerVillaEntries,
      });
      setSuccess('Caretaker Extras View Output generated successfully!');
    } catch (e: any) {
      setError('Failed to generate Caretaker Extras View Output.');
    }
    setSubmitting(false);
  };

  // Add handlers for Extras tab
  const handleAddExtrasVillaEntry = () => {
    setExtrasVillaEntries([...extrasVillaEntries, { villa_name: '', holiday_start_date: '', holiday_end_date: '', extras_aggregated: '', opportunity_name: '' }]);
  };
  const handleExtrasVillaEntryChange = (idx: number, field: string, value: string) => {
    setExtrasVillaEntries(extrasVillaEntries.map((entry, i) => i === idx ? { ...entry, [field]: value } : entry));
  };
  const handleRemoveExtrasVillaEntry = (idx: number) => {
    setExtrasVillaEntries(extrasVillaEntries.filter((_, i) => i !== idx));
  };

  // Add handlers for Caretaker tab
  const handleAddCaretakerVillaEntry = () => {
    setCaretakerVillaEntries([...caretakerVillaEntries, { villa_name: '', holiday_start_date: '', holiday_end_date: '', extras_aggregated: '', opportunity_name: '' }]);
  };
  const handleCaretakerVillaEntryChange = (idx: number, field: string, value: string) => {
    setCaretakerVillaEntries(caretakerVillaEntries.map((entry, i) => i === idx ? { ...entry, [field]: value } : entry));
  };
  const handleRemoveCaretakerVillaEntry = (idx: number) => {
    setCaretakerVillaEntries(caretakerVillaEntries.filter((_, i) => i !== idx));
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Generate Outputs</h2>
      <Nav variant="tabs" activeKey={activeTab} onSelect={k => setActiveTab(k as any)} className="mb-4">
        <Nav.Item><Nav.Link eventKey="APIS">APIS Report Output</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="Extras">Extras Filtered Reservation Output</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="Caretaker">Caretaker Extras View Output</Nav.Link></Nav.Item>
      </Nav>
      {loading ? <Spinner animation="border" /> : (
        <div className="card">
          <div className="card-body">
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {activeTab === 'APIS' && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>APIS Report File</Form.Label>
                  <Form.Select value={apisFileId} onChange={e => setApisFileId(e.target.value)}>
                    <option value="">Select file...</option>
                    {apisFiles.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Headers (columns)</Form.Label>
                  <Form.Control value={apisHeaders.join(',')} onChange={e => setApisHeaders(e.target.value.split(',').map(h => h.trim()))} placeholder="Comma-separated column names" />
                  <Form.Text>e.g. accomodation_name, opportunity_name, holiday_start_date, ...</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Opportunity Name</Form.Label>
                  <Form.Control value={apisOpportunity} onChange={e => setApisOpportunity(e.target.value)} />
                </Form.Group>
                <Button disabled={submitting || !apisFileId || !apisHeaders.length || !apisOpportunity} onClick={handleGenerateAPIS} variant="primary">
                  {submitting ? <Spinner size="sm" animation="border" /> : 'Generate APIS Output'}
                </Button>
              </Form>
            )}
            {activeTab === 'Extras' && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Resort Report File</Form.Label>
                  <Form.Select value={extrasFileId} onChange={e => setExtrasFileId(e.target.value)}>
                    <option value="">Select file...</option>
                    {resortFiles.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Headers (columns)</Form.Label>
                  <Form.Control value={extrasHeaders.join(',')} onChange={e => setExtrasHeaders(e.target.value.split(',').map(h => h.trim()))} placeholder="Comma-separated column names" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Villa Filters</Form.Label>
                  {villas.map(villa => (
                    <div key={villa.id} className="mb-2">
                      <strong>{villa.villa_name}</strong>
                      <div className="d-flex gap-2 flex-wrap mt-1">
                        {['Pool Heating', 'Complimentary Cot', 'Welcome Pack'].map(extra => (
                          <Form.Check
                            key={extra}
                            type="checkbox"
                            label={extra}
                            checked={extrasFilters[villa.id]?.includes(extra) || false}
                            onChange={() => handleExtrasFilterChange(villa.id, extra)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Individual Villa Entries</Form.Label>
                  {extrasVillaEntries.map((entry, idx) => (
                    <Row key={idx} className="mb-2 align-items-end">
                      <Col><Form.Control placeholder="Villa Name" value={entry.villa_name} onChange={e => handleExtrasVillaEntryChange(idx, 'villa_name', e.target.value)} /></Col>
                      <Col><Form.Control placeholder="Start Date" value={entry.holiday_start_date} onChange={e => handleExtrasVillaEntryChange(idx, 'holiday_start_date', e.target.value)} /></Col>
                      <Col><Form.Control placeholder="End Date" value={entry.holiday_end_date} onChange={e => handleExtrasVillaEntryChange(idx, 'holiday_end_date', e.target.value)} /></Col>
                      <Col><Form.Control placeholder="Extras" value={entry.extras_aggregated} onChange={e => handleExtrasVillaEntryChange(idx, 'extras_aggregated', e.target.value)} /></Col>
                      <Col><Form.Control placeholder="Opportunity" value={entry.opportunity_name} onChange={e => handleExtrasVillaEntryChange(idx, 'opportunity_name', e.target.value)} /></Col>
                      <Col xs="auto"><Button size="sm" variant="danger" onClick={() => handleRemoveExtrasVillaEntry(idx)}>&times;</Button></Col>
                    </Row>
                  ))}
                  <Button size="sm" variant="outline-primary" onClick={handleAddExtrasVillaEntry}>Add Entry</Button>
                </Form.Group>
                <Button disabled={submitting || !extrasFileId || !extrasHeaders.length} onClick={handleGenerateExtras} variant="primary">
                  {submitting ? <Spinner size="sm" animation="border" /> : 'Generate Extras Filtered Output'}
                </Button>
              </Form>
            )}
            {activeTab === 'Caretaker' && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Resort Report File</Form.Label>
                  <Form.Select value={caretakerFileId} onChange={e => setCaretakerFileId(e.target.value)}>
                    <option value="">Select file...</option>
                    {resortFiles.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Select Caretakers</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {caretakers.map(c => (
                      <Badge key={c.id} pill bg={selectedCaretakers.includes(c.id) ? 'primary' : 'secondary'} style={{ cursor: 'pointer' }} onClick={() => handleCaretakerSelect(c.id)}>
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Headers (columns)</Form.Label>
                  <Form.Control value={caretakerHeaders.join(',')} onChange={e => setCaretakerHeaders(e.target.value.split(',').map(h => h.trim()))} placeholder="Comma-separated column names" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Individual Villa Entries</Form.Label>
                  {caretakerVillaEntries.map((entry, idx) => (
                    <Row key={idx} className="mb-2 align-items-end">
                      <Col><Form.Control placeholder="Villa Name" value={entry.villa_name} onChange={e => handleCaretakerVillaEntryChange(idx, 'villa_name', e.target.value)} /></Col>
                      <Col><Form.Control placeholder="Start Date" value={entry.holiday_start_date} onChange={e => handleCaretakerVillaEntryChange(idx, 'holiday_start_date', e.target.value)} /></Col>
                      <Col><Form.Control placeholder="End Date" value={entry.holiday_end_date} onChange={e => handleCaretakerVillaEntryChange(idx, 'holiday_end_date', e.target.value)} /></Col>
                      <Col><Form.Control placeholder="Extras" value={entry.extras_aggregated} onChange={e => handleCaretakerVillaEntryChange(idx, 'extras_aggregated', e.target.value)} /></Col>
                      <Col><Form.Control placeholder="Opportunity" value={entry.opportunity_name} onChange={e => handleCaretakerVillaEntryChange(idx, 'opportunity_name', e.target.value)} /></Col>
                      <Col xs="auto"><Button size="sm" variant="danger" onClick={() => handleRemoveCaretakerVillaEntry(idx)}>&times;</Button></Col>
                    </Row>
                  ))}
                  <Button size="sm" variant="outline-primary" onClick={handleAddCaretakerVillaEntry}>Add Entry</Button>
                </Form.Group>
                <Button disabled={submitting || !caretakerFileId || !selectedCaretakers.length || !caretakerHeaders.length} onClick={handleGenerateCaretaker} variant="primary">
                  {submitting ? <Spinner size="sm" animation="border" /> : 'Generate Caretaker Extras View Output'}
                </Button>
              </Form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateOutputs; 