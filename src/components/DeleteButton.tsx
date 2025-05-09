import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'lg';
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, className = '', size = 'sm' }) => (
  <button
    type="button"
    className={`btn btn-danger btn-${size} ms-2 ${className}`}
    onClick={onClick}
    aria-label="Delete"
    style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size === 'sm' ? '32px' : '40px',
      height: size === 'sm' ? '32px' : '40px',
      padding: 0,
      borderRadius: '4px'
    }}
  >
    <i className="bi bi-x-lg" style={{ fontSize: size === 'sm' ? '14px' : '16px' }} aria-hidden="true"></i>
  </button>
);

export default DeleteButton;