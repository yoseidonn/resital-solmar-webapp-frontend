const API = '/api';

export async function getResortReports() {
  const res = await fetch(`${API}/resort-reports/`);
  return res.json();
}

export async function getResortReport(id: string | number) {
  const res = await fetch(`${API}/resort-reports/${id}`);
  return res.json();
}

export async function createResortReport(data: any) {
  const res = await fetch(`${API}/resort-reports/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateResortReport(id: string | number, data: any) {
  const res = await fetch(`${API}/resort-reports/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteResortReport(id: string | number) {
  const res = await fetch(`${API}/resort-reports/${id}`, { method: 'DELETE' });
  return res.json();
} 

export async function uploadResortReportFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API}/resort-reports/upload`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function downloadResortReportFile(id: string | number) {
  const res = await fetch(`${API}/resort-reports/${id}/download`);
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resort_report_${id}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}