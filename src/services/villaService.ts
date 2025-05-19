const API = 'http://localhost:8000';

export async function getVillas() {
  const res = await fetch(`${API}/villas/`);
  return res.json();
}

export async function getVilla(id: string | number) {
  const res = await fetch(`${API}/villas/${id}`);
  return res.json();
}

export async function createVilla(data: any) {
  const res = await fetch(`${API}/villas/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateVilla(id: string | number, data: any) {
  const res = await fetch(`${API}/villas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteVilla(id: string | number) {
  const res = await fetch(`${API}/villas/${id}`, { method: 'DELETE' });
  return res.json();
} 