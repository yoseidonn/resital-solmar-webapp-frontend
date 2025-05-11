const API = '/api';

const mockResortReportFiles = [
  {
    id: 1,
    name: 'Resort Report - Resital Group_01-04-25_unlocked',
    date: '2025-04-01',
    uploaded_at: '2025-04-01T09:00:00Z',
    file: 'Resort Report - Resital Group_01-04-25_unlocked.xlsx',
  },
  {
    id: 2,
    name: 'Resort Report - Resital Group_02-04-25_unlocked',
    date: '2025-04-02',
    uploaded_at: '2025-04-02T10:00:00Z',
    file: 'Resort Report - Resital Group_02-04-25_unlocked.xlsx',
  },
  {
    id: 3,
    name: 'Resort Report - Resital Group_03-04-25_unlocked',
    date: '2025-04-03',
    uploaded_at: '2025-04-03T11:00:00Z',
    file: 'Resort Report - Resital Group_03-04-25_unlocked.xlsx',
  },
];

export async function getResortReportFiles() {
  return mockResortReportFiles;
  // const res = await fetch(`${API}/resort-report-files/`);
  // return res.json();
}

export async function getResortReportFile(id: string | number) {
  return mockResortReportFiles.find(f => f.id === id) || mockResortReportFiles[0];
  // const res = await fetch(`${API}/resort-report-files/${id}`);
  // return res.json();
}

export async function createResortReportFile(data: any) {
  return { ...data, id: Date.now(), uploaded_at: new Date().toISOString() };
  // const res = await fetch(`${API}/resort-report-files/`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return res.json();
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

export async function uploadResortReportFile(file: File) {
  // Mock upload: return a new file object
  return {
    id: Date.now(),
    name: file.name,
    date: new Date().toISOString().slice(0, 10),
    uploaded_at: new Date().toISOString(),
    file: file.name,
  };
  // Real implementation:
  // const formData = new FormData();
  // formData.append('file', file);
  // const res = await fetch(`/api/resort-report-files/upload`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // return res.json();
}

export async function downloadResortReportFile(id: string | number) {
  // Mock download: just alert or no-op
  // In real: fetch and download the file
  // const res = await fetch(`/api/resort-report-files/${id}/download`);
  // if (!res.ok) throw new Error('Download failed');
  // const blob = await res.blob();
  // const url = window.URL.createObjectURL(blob);
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = `resort_report_file_${id}.xlsx`;
  // document.body.appendChild(a);
  // a.click();
  // a.remove();
  // window.URL.revokeObjectURL(url);
  return true;
} 