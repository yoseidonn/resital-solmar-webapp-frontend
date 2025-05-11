const API = '/api';

const mockAPISReportFiles = [
  {
    id: 1,
    name: 'APIS Report - Resital Group_01-04-2025_unlocked',
    date: '2025-04-01',
    uploaded_at: '2025-04-01T10:00:00Z',
    file: 'APIS Report - Resital Group_01-04-2025_unlocked.xlsx',
  },
  {
    id: 2,
    name: 'APIS Report - Resital Group_02-04-2025_unlocked',
    date: '2025-04-02', 
    uploaded_at: '2025-04-02T11:00:00Z',
    file: 'APIS Report - Resital Group_02-04-2025_unlocked.xlsx',
  },
  {
    id: 3,
    name: 'APIS Report - Resital Group_03-04-2025_unlocked',
    date: '2025-04-03',
    uploaded_at: '2025-04-03T12:00:00Z',
    file: 'APIS Report - Resital Group_03-04-2025_unlocked.xlsx',
  },
];

export async function getAPISReportFiles() {
  return mockAPISReportFiles;
  // const res = await fetch(`${API}/apis-report-files/`);
  // return res.json();
}

export async function getAPISReportFile(id: string | number) {
  return mockAPISReportFiles.find(f => f.id === id) || mockAPISReportFiles[0];
  // const res = await fetch(`${API}/apis-report-files/${id}`);
  // return res.json();
}

export async function createAPISReportFile(data: any) {
  return { ...data, id: Date.now(), uploaded_at: new Date().toISOString() };
  // const res = await fetch(`${API}/apis-report-files/`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return res.json();
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
  // const res = await fetch(`/api/apis-report-files/upload`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // return res.json();
}

export async function downloadAPISReportFile(id: string | number) {
  // Mock download: just alert or no-op
  // In real: fetch and download the file
  // const res = await fetch(`/api/apis-report-files/${id}/download`);
  // if (!res.ok) throw new Error('Download failed');
  // const blob = await res.blob();
  // const url = window.URL.createObjectURL(blob);
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = `apis_report_file_${id}.xlsx`;
  // document.body.appendChild(a);
  // a.click();
  // a.remove();
  // window.URL.revokeObjectURL(url);
  return true;
} 