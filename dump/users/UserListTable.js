import React from 'react';
import { Card, Button, Table, Form, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Plus, Pencil, Trash, House, ThermometerHalf, TruckFlatbed, GiftFill, Download, Upload } from 'react-bootstrap-icons';

// TODO: This is where fileService or firebaseService is used for user actions
const UserListTable = ({
  users,
  handleEdit,
  handleDelete,
  handleExportJson,
  handleImportJson,
  fileInputRef,
  handleFileChange,
  handleCreate
}) => (
  <Card className="shadow-sm mb-4">
    <Card.Header className="d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Kullanıcı Listesi</h5>
      <div>
        <Button 
          variant="outline-secondary" 
          className="me-2" 
          onClick={handleExportJson}
          title="Kullanıcıları JSON olarak dışa aktar"
        >
          <Download className="me-1" /> Dışa Aktar
        </Button>
        <Button 
          variant="outline-secondary" 
          className="me-2" 
          onClick={handleImportJson}
          title="JSON dosyasından kullanıcıları içe aktar"
        >
          <Upload className="me-1" /> İçe Aktar
        </Button>
        <Form.Control
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept=".json"
          onChange={handleFileChange}
        />
        <Button 
          variant="primary" 
          onClick={handleCreate}
        >
          <Plus className="me-1" /> Yeni Kullanıcı
        </Button>
      </div>
    </Card.Header>
    <Card.Body>
      <Table responsive hover className="align-middle">
        <thead className="table-light">
          <tr>
            <th>Kullanıcı Adı</th>
            <th>Atanan Villalar</th>
            <th className="text-end">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                <p className="text-muted mb-0">
                  Henüz kullanıcı bulunmuyor. Yeni bir kullanıcı ekleyebilirsiniz.
                </p>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="fw-medium">{user.name}</td>
                <td>
                  {user.villaRules && Object.keys(user.villaRules).length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(user.villaRules).map(([villaName, rules]) => (
                        <div 
                          key={villaName}
                          className="d-flex align-items-center border rounded py-1 px-2"
                        >
                          <House className="me-1" /> 
                          <span>{villaName}</span>
                          <div className="d-flex align-items-center ms-2">
                            {rules.showPoolHeating && (
                              <OverlayTrigger placement="top" overlay={<Tooltip>Havuz Isıtması</Tooltip>}>
                                <span className="me-1">
                                  <ThermometerHalf className="text-danger" />
                                </span>
                              </OverlayTrigger>
                            )}
                            {rules.showCot && (
                              <OverlayTrigger placement="top" overlay={<Tooltip>Bebek Yatağı</Tooltip>}>
                                <span className="me-1">
                                  <TruckFlatbed className="text-success" />
                                </span>
                              </OverlayTrigger>
                            )}
                            {rules.showWelcomePack && (
                              <OverlayTrigger placement="top" overlay={<Tooltip>Karşılama Paketi</Tooltip>}>
                                <span className="me-1">
                                  <GiftFill className="text-warning" />
                                </span>
                              </OverlayTrigger>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">Villa atanmamış</span>
                  )}
                </td>
                <td className="text-end">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
);

export default UserListTable; 