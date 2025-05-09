import React from 'react';

interface AssignedVillaBadgeProps {
  villaName: string;
  color?: string; // e.g., 'bg-info', 'bg-secondary'
}

const AssignedVillaBadge: React.FC<AssignedVillaBadgeProps> = ({ villaName, color = 'bg-info' }) => (
  <span className={`badge ${color} me-1`} aria-label={`Assigned villa: ${villaName}`}>{villaName}</span>
);

export default AssignedVillaBadge; 