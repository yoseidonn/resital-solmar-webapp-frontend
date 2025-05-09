import React from 'react';
import AssignedVillaBadge from './AssignedVillaBadge';
import ExtraIcon from './ExtraIcon';
import FilterRulesSection from './FilterRulesSection';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

interface CaretakerCardProps {
  caretaker: {
    id: string;
    name: string;
    phone_number: string;
    assigned_villas: Record<string, Record<string, boolean>>; // { [villaName]: { [extra]: bool } }
    filterRules?: string[];
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CaretakerCard: React.FC<CaretakerCardProps> = ({ caretaker, onEdit, onDelete }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2">
          <div>
            <h5 className="card-title mb-1">{caretaker.name}</h5>
            <div className="text-muted mb-2" style={{ fontSize: '0.95em' }}>{caretaker.phone_number}</div>
            <div className="mb-2">
              {Object.keys(caretaker.assigned_villas).map((villaName) => (
                <AssignedVillaBadge key={villaName} villaName={villaName} />
              ))}
            </div>
            <div className="mb-2">
              {Object.entries(caretaker.assigned_villas).map(([villaName, extras]) =>
                Object.entries(extras)
                  .filter(([_, value]) => value)
                  .map(([extra]) => (
                    <ExtraIcon key={villaName + extra} extraName={extra} />
                  ))
              )}
            </div>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <EditButton onClick={() => onEdit(caretaker.id)} />
            <DeleteButton onClick={() => onDelete(caretaker.id)} />
          </div>
        </div>
        <FilterRulesSection rules={caretaker.filterRules || []} />
      </div>
    </div>
  );
};

export default CaretakerCard; 