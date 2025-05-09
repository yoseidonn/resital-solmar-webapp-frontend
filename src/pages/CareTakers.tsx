import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchCaretakers, fetchVillas } from '../services/api';
import CaretakerListTable from '../components/CaretakerListTable';
import SummaryCard from '../components/SummaryCard';
import { Modal, Button, Form, Row, Col, Accordion } from 'react-bootstrap';

const defaultExtras = ['Pool Heating', 'Complimentary Cot', 'Welcome Pack'];

const CareTakers: React.FC = () => {
  const [caretakers, setCaretakers] = useState<any[]>([]);
  const [villas, setVillas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<any>({
    id: '',
    name: '',
    phone_number: '',
    assigned_villas: {},
    rules: [],
  });
  const [expandedVilla, setExpandedVilla] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [caretakersData, villasData] = await Promise.all([
        fetchCaretakers(),
        fetchVillas(),
      ]);
      setCaretakers(caretakersData);
      setVillas(villasData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAdd = () => {
    setIsEditing(false);
    setFormValues({ id: '', name: '', phone_number: '', assigned_villas: {}, rules: [] });
    setShowModal(true);
  };

  const handleEdit = (caretaker: any) => {
    setIsEditing(true);
    setFormValues({ ...caretaker });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete logic
    alert('Delete caretaker ' + id);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleVillaToggle = (villaName: string) => {
    setFormValues((prev: any) => {
      const assigned = { ...prev.assigned_villas };
      if (assigned[villaName]) {
        delete assigned[villaName];
      } else {
        assigned[villaName] = [];
      }
      return { ...prev, assigned_villas: assigned };
    });
  };

  const handleExtraToggle = (villaName: string, extra: string) => {
    setFormValues((prev: any) => {
      const assigned = { ...prev.assigned_villas };
      let extras: string[] = Array.isArray(assigned[villaName]) ? [...assigned[villaName]] : [];
      if (extras.includes(extra)) {
        extras = extras.filter(e => e !== extra);
      } else {
        extras.push(extra);
      }
      assigned[villaName] = extras;
      return { ...prev, assigned_villas: assigned };
    });
  };

  const handleRuleToggle = (rule: string) => {
    setFormValues((prev: any) => {
      let rules: string[] = Array.isArray(prev.rules) ? [...prev.rules] : [];
      if (rules.includes(rule)) {
        rules = rules.filter(r => r !== rule);
      } else {
        rules.push(rule);
      }
      return { ...prev, rules };
    });
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalSave = () => {
    // TODO: Implement save logic
    setShowModal(false);
  };

  const handleExpandVilla = (villaName: string) => {
    setExpandedVilla((prev) => (prev === villaName ? null : villaName));
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <SummaryCard title="Care Takers" icon="bi-people" count={caretakers.length} />
          <CaretakerListTable caretakers={caretakers} handleEdit={handleEdit} handleDelete={handleDelete} handleAdd={handleAdd} />
          {loading && <LoadingSpinner />}
        </div>
      </div>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Caretaker' : 'Add Caretaker'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formValues.name} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control name="phone_number" value={formValues.phone_number} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assign Villas</Form.Label>
              <div>
                <ul className="list-group">
                  {villas.map((villa: any) => (
                    <li key={villa.villa_name} className="list-group-item px-2 py-1">
                      <Form.Check
                        type="checkbox"
                        label={villa.villa_name}
                        checked={!!formValues.assigned_villas[villa.villa_name]}
                        onChange={() => handleVillaToggle(villa.villa_name)}
                      />
                      {formValues.assigned_villas[villa.villa_name] && (
                        <ul className="list-group mt-2 ms-4">
                          {defaultExtras.map((extra) => (
                            <li key={extra} className="list-group-item px-2 py-1">
                              <Form.Check
                                type="checkbox"
                                label={extra}
                                checked={Array.isArray(formValues.assigned_villas[villa.villa_name]) && formValues.assigned_villas[villa.villa_name].includes(extra)}
                                onChange={() => handleExtraToggle(villa.villa_name, extra)}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 mt-3">
              <Form.Label>Rules (Filters)</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {defaultExtras.map((rule) => (
                  <Form.Check
                    key={rule}
                    type="checkbox"
                    label={rule}
                    checked={Array.isArray(formValues.rules) && formValues.rules.includes(rule)}
                    onChange={() => handleRuleToggle(rule)}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button variant="primary" onClick={handleModalSave}>{isEditing ? 'Save Changes' : 'Add Caretaker'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CareTakers;