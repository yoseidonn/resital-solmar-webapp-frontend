import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import SummaryCard from '../components/SummaryCard';
import EntityList from '../components/EntityList';
import type { CareTaker, Villa } from '../services/models';
import * as careTakerService from '../services/careTakerService';
import * as villaService from '../services/villaService';
import { Modal, Button, Form } from 'react-bootstrap';
import BadgeRow from '../components/BadgeRow';
import ExtraIcon from '../components/ExtraIcon';

const defaultExtras = ['Pool Heating', 'Complimentary Cot', 'Welcome Pack'];

const CareTakers: React.FC = () => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [caretakers, setCaretakers] = useState<CareTaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<CareTaker>({
    id: 0,
    name: '',
    phone_number: '',
    assigned_villas: {},
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [caretakerToDelete, setCaretakerToDelete] = useState<CareTaker | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const careTakersData = await careTakerService.getCareTakers();
    const villasData = await villaService.getVillas();
    setCaretakers(careTakersData);
    setVillas(villasData);
    setLoading(false);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormValues({
      id: 0,
      name: '',
      phone_number: '',
      assigned_villas: {},
    });
    setShowModal(true);
  };

  const openEditModal = async (caretaker: CareTaker) => {
    const caretakerData = await careTakerService.getCareTaker(caretaker.id);
    if (!caretakerData) {
      return;
    }
    setIsEditing(true);
    setFormValues({ ...caretakerData });
    setShowModal(true);
  };

  const openDeleteModal = (caretaker: CareTaker) => {
    if (!caretaker) {
      return;
    }
    setCaretakerToDelete(caretaker);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (caretakerToDelete) {
      const response = await careTakerService.deleteCareTaker(caretakerToDelete.id);
      if (response.success) {
        setCaretakers(caretakers.filter(c => c.id !== caretakerToDelete.id));
        setShowDeleteConfirm(false);
        setCaretakerToDelete(null);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleExtraToggle = (villaId: string | number, extra: string) => {
    setFormValues((prev: any) => {
      const assigned = { ...prev.assigned_villas };
      let extras: string[] = Array.isArray(assigned[villaId]) ? [...assigned[villaId]] : [];
      if (extras.includes(extra)) {
        extras = extras.filter(e => e !== extra);
      } else {
        extras.push(extra);
      }
      assigned[villaId] = extras;
      return { ...prev, assigned_villas: assigned };
    });
  };

  const handleVillaToggle = (villa: Villa) => {
    setFormValues((prev: any) => {
      const assigned = { ...prev.assigned_villas };
      if (assigned[villa.id]) {
        delete assigned[villa.id];
      } else {
        assigned[villa.id] = [];
      }
      return { ...prev, assigned_villas: assigned };
    });
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalSave = async () => {
    if (isEditing) {
      await careTakerService.updateCareTaker(formValues.id, formValues);
    } else {
      await careTakerService.createCareTaker(formValues);
    }
    setShowModal(false);
    await loadData();
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <EntityList
            items={caretakers}
            headers={["Name", "Phone", "Villas", "Actions"]}
            renderItem={(caretaker) => [
              // Name
              <span className="fw-medium">{caretaker.name}</span>,
              // Phone
              <span>{caretaker.phone_number}</span>,
              // Villas + extras
              <span>
                {Object.entries(caretaker.assigned_villas).map(([villaId, extras]) => (
                  <BadgeRow key={villaId} className="badge bg-info mb-1">
                    <span className="text-dark me-2" style={{ fontSize: '1.2em' }}>{villas.find(v => v.id === Number(villaId))?.villa_name}</span>
                    {extras.map((extra) => (
                      <ExtraIcon key={villaId + extra} extraName={extra}/>
                    ))}
                  </BadgeRow>
                ))}
              </span>,
              // Actions
              <span className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm" onClick={() => openEditModal(caretaker)}>
                  <i className="bi bi-pencil"></i>
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => openDeleteModal(caretaker)}>
                  <i className="bi bi-trash"></i>
                </button>
              </span>
            ]}
          >
            <SummaryCard title="Care Takers" icon="bi-people" count={caretakers.length} />
            <div className="mb-3 text-end">
              <Button variant="primary" onClick={openAddModal}>
                <i className="bi bi-plus-lg me-1"></i> Add Caretaker
              </Button>
            </div>
          </EntityList>
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
              <Form.Control name="name" value={formValues.name || ''} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control name="phone_number" value={formValues.phone_number || ''} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Assign Villas</Form.Label>
              <div>
                <ul className="list-group">
                  {villas.map((villa) => {
                    const isChecked = Boolean(formValues.assigned_villas[villa.id]);
                    return (
                      <li key={villa.id} className="list-group-item">
                        <Form.Check
                          type="checkbox"
                          label={villa.villa_name}
                          checked={isChecked}
                          onChange={() => handleVillaToggle(villa)}
                        />
                        {isChecked && (
                          <div className="ms-4 mt-2">
                            {defaultExtras.map((extra) => (
                              <Form.Check
                                key={`${villa.id}-${extra}`}
                                type="checkbox"
                                label={extra}
                                checked={formValues.assigned_villas[villa.id]?.includes(extra) || false}
                                onChange={() => handleExtraToggle(villa.id, extra)}
                              />
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button variant="primary" onClick={handleModalSave}>{isEditing ? 'Save Changes' : 'Add Caretaker'}</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this caretaker: {caretakerToDelete?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CareTakers;