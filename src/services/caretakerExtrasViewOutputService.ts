import type { CaretakerExtrasViewOutput } from './models';

const API = 'http://localhost:8000';

export async function getCaretakerExtrasViewOutputs() {
  const res = await fetch(`${API}/caretaker-extras-view-outputs/`);
  return res.json();
}

export async function downloadCaretakerExtrasViewExcel(output: CaretakerExtrasViewOutput) {
  window.open(`${API}/caretaker-extras-view-outputs/download/${output.fileName}`, '_blank');
}

export async function downloadCaretakerExtrasViewJSON(output: CaretakerExtrasViewOutput) {
  const res = await fetch(`${API}/caretaker-extras-view-outputs/by-file/${output.resort_report_file}`);
  return res.json();
}

export async function downloadCaretakerExtrasViewText(output: CaretakerExtrasViewOutput) {
  const text = Object.entries(output.content)
    .map(([caretaker, text]) => `--- ${caretaker} ---\n${text}`)
    .join('\n\n');
  return text;
}

export async function generateCaretakerExtrasViewOutput(fileId: string | number, request: any) {
  const res = await fetch(`${API}/caretaker-extras-view-outputs/generate/${fileId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return res.json();
} 