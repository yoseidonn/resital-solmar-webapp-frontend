import { useEffect, useState } from 'react';
import StatBar from '../components/StatBar';
import CaretakerList from '../components/CaretakerList';
import CaretakerForm from '../components/CaretakerForm';
import { fetchCaretakers, fetchVillas } from '../services/api';
import type { FC } from 'react';


type Caretaker = {
  id: string;
  name: string;
  phone_number: string;
  assigned_villas: string[];
  extras: Record<string, any>;
};

type Villa = {
  id: string;
  villa_name: string;
  phone_number: string;
};

const CareTakers: FC = () => {
  const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCaretaker, setEditCaretaker] = useState(null);

  useEffect(() => {
    fetchCaretakers().then(setCaretakers);
    fetchVillas().then(setVillas);
  }, []);

  const handleAdd = () => {
    setEditCaretaker(null);
    setShowForm(true);
  };

  const handleEdit = (caretaker: any) => {
    setEditCaretaker(caretaker);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditCaretaker(null);
    fetchCaretakers().then(setCaretakers);
  };

  return (
    <div>
      <StatBar stats={[
        { label: 'Caretakers', value: caretakers.length },
        { label: 'Villas', value: villas.length },
      ]} />
      <button onClick={handleAdd}>Add Caretaker</button>
      <CaretakerList caretakers={caretakers} onEdit={handleEdit} />
      {showForm && (
        <CaretakerForm
          caretaker={editCaretaker}
          villas={villas}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default CareTakers; 