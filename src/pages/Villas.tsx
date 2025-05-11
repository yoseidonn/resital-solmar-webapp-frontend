import React, { useEffect, useState } from 'react';
import EntityList from '../components/EntityList';
import SummaryCard from '../components/SummaryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Villa, CareTaker } from '../services/models';
import * as villaService from '../services/villaService';
import * as careTakerService from '../services/careTakerService';
import { Button, Modal, Form } from 'react-bootstrap';
import DeleteButton from '../components/DeleteButton';
import EditButton from '../components/EditButton';

const Villas: React.FC = () => {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [caretakers, setCaretakers] = useState<CareTaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVillaModal, setShowVillaModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [villaToEdit, setVillaToEdit] = useState<Villa | null>(null);
  const [formValues, setFormValues] = useState<Partial<Villa>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [villaToDelete, setVillaToDelete] = useState<Villa | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [villaData, caretakerData] = await Promise.all([
      villaService.getVillas(),
      careTakerService.getCareTakers(),
    ]);
    setVillas(villaData);
    setCaretakers(caretakerData);
    setLoading(false);
  };

  const getCaretakerName = (caretakerId: string | number | undefined) => {
    const caretaker = caretakers.find(c => c.id === caretakerId);
    return caretaker ? caretaker.name : undefined;
  };

  const handleAdd = () => {
    setIsEditing(false);
    setFormValues({});
    setShowVillaModal(true);
  };

  const handleEdit = (villa: Villa) => {
    setIsEditing(true);
    setVillaToEdit(villa);
    setFormValues(villa);
    setShowVillaModal(true);
  };

  const handleDelete = (villa: Villa) => {
    setVillaToDelete(villa);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (villaToDelete) {
      await villaService.deleteVilla(villaToDelete.id);
      setVillas(villas.filter(v => v.id !== villaToDelete.id));
      setShowDeleteConfirm(false);
      setVillaToDelete(null);
    }
  };

  const handleVillaModalClose = () => {
    setShowVillaModal(false);
    setVillaToEdit(null);
    setFormValues({});
  };

  const handleVillaFormChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleVillaModalSave = async () => {
    if (isEditing && villaToEdit) {
      await villaService.updateVilla(villaToEdit.id, formValues);
    } else {
      await villaService.createVilla(formValues);
    }
    await loadData();
    setShowVillaModal(false);
    setVillaToEdit(null);
    setFormValues({});
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <EntityList
            headers={["Name", "Caretaker", "Actions"]}
            items={villas}
            renderItem={(villa) => [
              <span className="fw-medium">{villa.villa_name}</span>,
              <span className="badge bg-info">{getCaretakerName(villa.caretaker_id)}</span>,
              <span className="d-flex gap-2">
                <EditButton onClick={() => handleEdit(villa)} />
                <DeleteButton onClick={() => handleDelete(villa)} />
              </span>
            ]}
          >
            <SummaryCard title="Villas" icon="bi-house" count={villas.length} />
            <div className="mb-3 text-end">
              <Button variant="primary" onClick={handleAdd}> <i className="bi bi-plus-lg me-1"></i> Add Villa</Button>
            </div>
          </EntityList>
          {loading && <LoadingSpinner />}
        </div>
      </div>
      <Modal show={showVillaModal} onHide={handleVillaModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Villa' : 'Add Villa'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="villa_name" value={formValues.villa_name || ''} onChange={handleVillaFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control name="phone_number" value={formValues.phone_number || ''} onChange={handleVillaFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Caretaker</Form.Label>
              <Form.Select name="caretaker_id" value={formValues.caretaker_id || ''} onChange={handleVillaFormChange}>
                <option value="">Unassigned</option>
                {caretakers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleVillaModalClose}>Cancel</Button>
          <Button variant="primary" onClick={handleVillaModalSave}>{isEditing ? 'Save Changes' : 'Add Villa'}</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this villa: {villaToDelete?.villa_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Villas;
