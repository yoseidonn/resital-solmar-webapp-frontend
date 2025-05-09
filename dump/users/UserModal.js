import React from 'react';
import { Modal, Form, Button, Card, Row } from 'react-bootstrap';
import VillaSelection from './VillaSelection';

// TODO: This is where fileService or firebaseService is used for user add/edit
const UserModal = ({
  show,
  onHide,
  isEditing,
  formValues,
  handleChange,
  villas,
  handleVillaChange,
  handleExtraChange,
  handleToggleAllExtrasForVilla,
  handleToggleAllVillas,
  handleSave
}) => (
  <Modal show={show} onHide={onHide} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>{isEditing ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group className="mb-4">
          <Form.Label>Kullanıcı Adı</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="fw-medium">Villalar ve Ekstralar</Form.Label>
            <Button 
              variant="link" 
              size="sm" 
              onClick={handleToggleAllVillas}
              disabled={villas.length === 0}
              className="p-0"
            >
              {Object.keys(formValues.villaRules).length === villas.length 
                ? 'Tüm Seçimi Kaldır' 
                : 'Tüm Villaları Seç'}
            </Button>
          </div>
          {villas.length === 0 ? (
            <div className="alert alert-info">
              Henüz villa bulunmuyor. Önce villa eklemeniz gerekiyor.
            </div>
          ) : (
            <div className="villa-selection mb-3">
              <Row xs={1} className="g-3">
                <VillaSelection
                  villas={villas}
                  villaRules={formValues.villaRules}
                  handleVillaChange={handleVillaChange}
                  handleExtraChange={handleExtraChange}
                  handleToggleAllExtrasForVilla={handleToggleAllExtrasForVilla}
                />
              </Row>
            </div>
          )}
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        İptal
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Kaydet
      </Button>
    </Modal.Footer>
  </Modal>
);

export default UserModal; 