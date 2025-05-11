const mockResortReportOutputs = [
  {
    id: 'resort-output-1',
    resort_report_file: 1,
    fileName: 'Resort Report - Resital Group_01-04-25_unlocked.xlsx',
    generatedDate: '2025-04-01T16:00:00Z',
    messages: {
      'User1': 'Check-in completed',
      'User2': 'Welcome package delivered',
    },
    rows: [
      { villa: 'Villa Diana', guest: 'John Doe', status: 'Checked-in' },
      { villa: 'Villa Diana', guest: 'Jane Smith', status: 'Checked-in' },
    ],
    content: { summary: 'Summary 1', details: [{ villa: 'Villa Diana', guest: 'John Doe' }] },
    created_at: '2025-04-01T16:00:00Z',
  },
  {
    id: 'resort-output-2',
    resort_report_file: 2,
    fileName: 'Resort Report - Resital Group_02-04-25_unlocked.xlsx',
    generatedDate: '2025-04-02T17:00:00Z',
    messages: {
      'User3': 'Check-out completed',
      'User4': 'Cleaning scheduled',
    },
    rows: [
      { villa: 'Villa Sunset', guest: 'Jane Smith', status: 'Checked-out' },
    ],
    content: { summary: 'Summary 2', details: [{ villa: 'Villa Sunset', guest: 'Jane Smith' }] },
    created_at: '2025-04-02T17:00:00Z',
  },
];

const API = '/api';

export async function getResortReportOutputs() {
  return mockResortReportOutputs;
  // const res = await fetch(`${API}/resort-report-outputs/`);
  // return res.json();
}

export async function getResortReportOutputsByFile(fileId: string | number) {
  return mockResortReportOutputs.filter(o => o.resort_report_file === fileId);
  // const res = await fetch(`${API}/resort-report-outputs/by-file/${fileId}`);
  // return res.json();
}

export async function generateResortReportOutput(fileId: string | number, selectedUsers: any[]) {
  return { id: Date.now(), resort_report_file: fileId, content: { summary: 'Generated', details: selectedUsers }, created_at: new Date().toISOString() };
  // const res = await fetch(`${API}/resort-report-outputs/generate/${fileId}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(selectedUsers),
  // });
  // return res.json();
} 