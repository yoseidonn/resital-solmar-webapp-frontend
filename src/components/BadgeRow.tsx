import React from 'react';

interface BadgeRowProps {
  children: React.ReactNode;
  className?: string;
}

const BadgeRow: React.FC<BadgeRowProps> = ({ children, className = '' }) => (
  <div className={`d-flex flex-row align-items-center gap-1 ${className}`}>{children}</div>
);

export default BadgeRow; 