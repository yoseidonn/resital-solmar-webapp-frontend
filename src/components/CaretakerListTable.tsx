import React, { useState } from 'react';
import AssignedVillaBadge from './AssignedVillaBadge';
import ExtraIcon from './ExtraIcon';
import { Button, Modal } from 'react-bootstrap';

interface CaretakerListTableProps {
  caretakers: any[];
  handleEdit: (caretaker: any) => void;
  handleDelete: (id: string) => void;
  handleAdd: () => void;
}

const CaretakerListTable: React.FC<CaretakerListTableProps> = ({ caretakers, handleEdit, handleDelete, handleAdd }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const doDelete = () => {
    if (deleteId) handleDelete(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Caretaker List</h5>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-1"></i> Add Caretaker
        </Button>
      </div>
      <div className="card-body">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Assigned Villas</th>
              <th>Rules</th>
              <th>Phone</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {caretakers.length === 0 ? (
              <tr key="no-caretakers">
                <td colSpan={5} className="text-center py-4">
                  <p className="text-muted mb-0">No caretakers found. Add a new caretaker to get started.</p>
                </td>
              </tr>
            ) : (
              caretakers.map((caretaker, index) => (
                <tr key={caretaker.id || `caretaker-${index}`}> 
                  <td className="fw-medium">{caretaker.name}</td>
                  <td>
                    {caretaker.assigned_villas && Object.keys(caretaker.assigned_villas).length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {Object.entries(caretaker.assigned_villas).map(([villaName, extras]) => (
                          <div key={villaName} className="d-flex align-items-center border rounded py-1 px-2">
                            <AssignedVillaBadge villaName={villaName} />
                            <div className="d-flex align-items-center ms-2">
                              {Array.isArray(extras) && extras.map((extra: string) => (
                                <ExtraIcon key={villaName + extra} extraName={extra} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No villas assigned</span>
                    )}
                  </td>
                  <td>
                    {Array.isArray(caretaker.rules) && caretaker.rules.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {caretaker.rules.map((rule: string) => (
                          <ExtraIcon key={rule} extraName={rule} />
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">No rules</span>
                    )}
                  </td>
                  <td>{caretaker.phone_number || <span className="text-muted">-</span>}</td>
                  <td className="text-end">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(caretaker)}>
                      <i className="bi bi-pencil me-1"></i> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(caretaker.id)}>
                      <i className="bi bi-trash me-1"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this caretaker? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={doDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CaretakerListTable; 