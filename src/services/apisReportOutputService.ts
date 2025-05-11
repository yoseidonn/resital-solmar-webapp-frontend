const API = '/api';

const mockAPISReportOutputs = [
  {
    id: 'apis-output-1',
    apis_report_file: 1,
    fileName: 'APIS Report - Resital Group_01-04-2025_unlocked.xlsx',
    generatedDate: '2025-04-01T13:00:00Z',
    villa: 'Villa Diana',
    date: '2025-04-01',
    rows: [
      { guest: 'John Doe', passport: '123456', nationality: 'TR' },
      { guest: 'Jane Smith', passport: '654321', nationality: 'UK' },
    ],
    messages: {
      'John Doe': 'Passport valid',
      'Jane Smith': 'Visa required',
    },
    file_path: 'APIS Report - Resital Group_01-06-2024_unlocked.xlsx',
    created_at: '2025-04-01T13:00:00Z',
  },
  {
    id: 'apis-output-2',
    apis_report_file: 2,
    fileName: 'APIS Report - Resital Group_02-04-2025_unlocked.xlsx',
    generatedDate: '2025-04-02T14:00:00Z',
    villa: 'Villa Sunset',
    date: '2025-04-02',
    rows: [
      { guest: 'Alice', passport: '111222', nationality: 'DE' },
    ],
    messages: {
      'Alice': 'All clear',
    },
    file_path: 'APIS Report - Resital Group_02-06-2024_unlocked.xlsx',
    created_at: '2025-04-02T14:00:00Z',
  },
];

export async function getAPISReportOutputs() {
  return mockAPISReportOutputs;
  // const res = await fetch(`${API}/apis-report-outputs/`);
  // return res.json();
}

export async function getAPISReportOutputsByFile(fileId: string | number) {
  return mockAPISReportOutputs.filter(o => o.apis_report_file === fileId);
  // const res = await fetch(`${API}/apis-report-outputs/by-file/${fileId}`);
  // return res.json();
}

export async function generateAPISReportOutput(fileId: string | number, request: any) {
  return { id: Date.now(), apis_report_file: fileId, file_path: 'output_new.xlsx', created_at: new Date().toISOString() };
  // const res = await fetch(`${API}/apis-report-outputs/generate/${fileId}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(request),
  // });
  // return res.json();
} 