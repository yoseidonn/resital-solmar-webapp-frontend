import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { People } from 'react-bootstrap-icons';

const UserSummaryCard = ({ userCount }) => (
  <Card className="mb-4 shadow-sm">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <People size={24} className="text-primary me-2" />
          <h5 className="mb-0">Kullanıcılar</h5>
        </div>
        <h2>
          <Badge bg="primary">{userCount}</Badge>
        </h2>
      </div>
    </Card.Body>
  </Card>
);

export default UserSummaryCard; 