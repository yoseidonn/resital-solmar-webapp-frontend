import React from 'react';

interface ExtraIconProps {
  extraName: string;
  iconClass?: string; // e.g., 'bi bi-droplet' for Pool Heating
  color?: string; // e.g., 'text-primary', 'text-success'
}

const defaultIcons: Record<string, string> = {
  'Pool Heating': 'bi bi-thermometer-half',
  'Complimentary Cot': 'bi bi-person',
  'Welcome Pack': 'bi bi-gift',
};

const defaultColors: Record<string, string> = {
  'Pool Heating': 'text-primary',
  'Complimentary Cot': 'text-warning',
  'Welcome Pack': 'text-success',
};

const ExtraIcon: React.FC<ExtraIconProps> = ({ extraName, iconClass, color }) => {
  const icon = iconClass || defaultIcons[extraName] || 'bi bi-star';
  const colorClass = color || defaultColors[extraName] || 'text-secondary';
  return (
    <span className={`mx-1 ${colorClass}`} title={extraName} aria-label={extraName} style={{ fontSize: '1.2em' }}>
      <i className={icon} aria-hidden="true"></i>
    </span>
  );
};

export default ExtraIcon; 