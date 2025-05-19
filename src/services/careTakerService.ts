const API = 'http://localhost:8000';

export async function getCareTakers() {
  const res = await fetch(`${API}/caretakers/`);
  return res.json();
}

export async function getCareTaker(id: string | number) {
  const res = await fetch(`${API}/caretakers/${id}`);
  return res.json();
}

export async function createCareTaker(data: any) {
  const res = await fetch(`${API}/caretakers/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCareTaker(id: string | number, data: any) {
  const res = await fetch(`${API}/caretakers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCareTaker(id: string | number) {
  const res = await fetch(`${API}/caretakers/${id}`, { method: 'DELETE' });
  return res.json();
} 