import React from 'react';

interface SummaryCardProps {
  title: string;
  icon: string; // Bootstrap icon class, e.g. 'bi-people'
  count: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, icon, count }) => (
  <div className="card mb-4 shadow-sm">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <i className={`${icon} text-primary me-2`} style={{ fontSize: 24 }}></i>
          <h5 className="mb-0">{title}</h5>
        </div>
        <h2>
          <span className="badge bg-primary">{count}</span>
        </h2>
      </div>
    </div>
  </div>
);

export default SummaryCard; 