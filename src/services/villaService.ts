const API = '/api';

const mockVillas = [
  {
    id: 1,
    villa_name: 'Villa Diana',
    phone_number: '555-0001',
    caretaker_id: 1,
  },
  {
    id: 2,
    villa_name: 'Villa Sunset',
    phone_number: '555-0002',
    caretaker_id: 2,
  },
  {
    id: 3,
    villa_name: 'Villa Mara S',
    phone_number: '555-0003',
    caretaker_id: 1,
  },
];

export async function getVillas() {
  return mockVillas;
  // const res = await fetch(`${API}/villas/`);
  // return res.json();
}

export async function getVilla(id: string | number) {
  return mockVillas.find(v => v.id === id) || mockVillas[0];
  // const res = await fetch(`${API}/villas/${id}`);
  // return res.json();
}

export async function createVilla(data: any) {
  return { ...data, id: Date.now().toString() };
  // const res = await fetch(`${API}/villas/`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return res.json();
}

export async function updateVilla(id: string | number, data: any) {
  return { ...data, id };
  // const res = await fetch(`${API}/villas/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return res.json();
}

export async function deleteVilla(id: string | number) {
  return { ok: true };
  // const res = await fetch(`${API}/villas/${id}`, { method: 'DELETE' });
  // return res.json();
} 