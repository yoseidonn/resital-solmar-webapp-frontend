const API = '/api';

const mockCareTakers = [
  {
    id: 1,
    name: 'John Doe',
    phone_number: '555-1234',
    assigned_villas: { 1: ['Pool Heating', 'Complimentary Cot'], 3: ['Welcome Pack'], 2: [] },
    rules: ['Pool Heating', 'Complimentary Cot'],
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone_number: '555-5678',
    assigned_villas: { 2: ['Pool Heating'], 1: [], 3: [] },
    rules: ['Pool Heating'],
  },
];

export async function getCareTakers() {
  return mockCareTakers;
  // const res = await fetch(`${API}/caretakers/`);
  // return res.json();
}

export async function getCareTaker(id: string | number) {
  return mockCareTakers.find(c => c.id === id) || mockCareTakers[0];
  // const res = await fetch(`${API}/caretakers/${id}`);
  // return res.json();
}

export async function createCareTaker(data: any) {
  return { ...data, id: Date.now().toString() };
  // const res = await fetch(`${API}/caretakers/`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return res.json();
}

export async function updateCareTaker(id: string | number, data: any) {
  return { ...data, id };
  // const res = await fetch(`${API}/caretakers/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return res.json();
}

export async function deleteCareTaker(id: string | number) {
  return { ok: true };
  // const res = await fetch(`${API}/caretakers/${id}`, { method: 'DELETE' });
  // return res.json();
} 