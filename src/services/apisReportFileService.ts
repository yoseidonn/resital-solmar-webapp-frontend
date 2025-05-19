const API = 'http://localhost:8000';

export async function getAPISReportFiles() {
  const res = await fetch(`${API}/apis-report-files/`);
  return res.json();
}

export async function getAPISReportFile(id: string | number) {
  const res = await fetch(`${API}/apis-report-files/${id}`);
  return res.json();
}

export async function createAPISReportFile(data: any) {
  const res = await fetch(`${API}/apis-report-files/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateAPISReportFile(id: string | number, data: any) {
  const res = await fetch(`${API}/apis-report-files/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteAPISReportFile(id: string | number) {
  const res = await fetch(`${API}/apis-report-files/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function uploadAPISReportFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API}/apis-report-files/upload`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function downloadAPISReportFile(id: string | number) {
  const res = await fetch(`${API}/apis-report-files/${id}/download`);
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `apis_report_file_${id}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
} 