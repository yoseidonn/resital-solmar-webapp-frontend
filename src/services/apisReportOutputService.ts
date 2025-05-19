import type { APISReportOutput } from './models';

const API = 'http://localhost:8000';

export async function getAPISReportOutputs() {
  const res = await fetch(`${API}/apis-report-outputs/`);
  return res.json();
}

export async function getAPISReportOutputsByFile(fileId: string | number) {
  const res = await fetch(`${API}/apis-report-outputs/by-file/${fileId}`);
  return res.json();
}

export async function generateAPISReportOutput(fileId: string | number, request: any) {
  const res = await fetch(`${API}/apis-report-outputs/generate/${fileId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return res.json();
}

export async function downloadAPISReportExcel(output: APISReportOutput) {
  window.open(`${API}/apis-report-outputs/download/${output.file_path}`, '_blank');
}

export async function downloadAPISReportJSON(output: APISReportOutput) {
  const res = await fetch(`${API}/apis-report-outputs/by-file/${output.apis_report_file}`);
  return res.json();
} 