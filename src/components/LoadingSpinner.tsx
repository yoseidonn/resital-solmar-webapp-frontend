import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: 120 }}>
    <div className="spinner-border text-primary" role="status" aria-label="Loading">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default LoadingSpinner; 