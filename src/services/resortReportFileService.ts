const API = 'http://localhost:8000';

// Step 1: Upload the file and get the filename/path
export async function uploadResortReportFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API}/resort-report-files/upload`, {
    method: 'POST',
    body: formData,
  });
  return res.json(); // { file, file_path }
}

// Step 2: Create the metadata record using the uploaded filename
export async function createResortReportFile(data: { name: string, date: string, file: string }) {
  const res = await fetch(`${API}/resort-report-files/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getResortReportFiles() {
  const res = await fetch(`${API}/resort-report-files/`);
  return res.json();
}

export async function getResortReportFile(id: string | number) {
  const res = await fetch(`${API}/resort-report-files/${id}`);
  return res.json();
}

export async function updateResortReportFile(id: string | number, data: any) {
  const res = await fetch(`${API}/resort-report-files/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteResortReportFile(id: string | number) {
  const res = await fetch(`${API}/resort-report-files/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function downloadResortReportFile(id: string | number) {
  const res = await fetch(`${API}/resort-report-files/${id}/download`);
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resort_report_file_${id}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
} 