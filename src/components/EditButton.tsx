import React from 'react';

interface EditButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'lg';
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, className = '', size = 'sm' }) => (
  <button
    type="button"
    className={`btn btn-outline-primary btn-${size} ${className}`}
    onClick={onClick}
    aria-label="Edit"
    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
  >
    <i className="bi bi-pencil-square" aria-hidden="true"></i>
  </button>
);

export default EditButton; 