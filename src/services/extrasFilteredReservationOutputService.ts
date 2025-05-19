import type { ExtrasFilteredReservationOutput } from './models';

const API = 'http://localhost:8000';

export async function getExtrasFilteredReservationOutputs() {
  const res = await fetch(`${API}/extras-filtered-reservation-outputs/`);
  return res.json();
}

export async function downloadExtrasFilteredReservationExcel(output: ExtrasFilteredReservationOutput) {
  window.open(`${API}/extras-filtered-reservation-outputs/download/${output.file_name}`, '_blank');
}

export async function downloadExtrasFilteredReservationJSON(output: ExtrasFilteredReservationOutput) {
  const res = await fetch(`${API}/extras-filtered-reservation-outputs/by-file/${output.resort_report_file}`);
  return res.json();
}

export async function generateExtrasFilteredReservationOutput(fileId: string | number, request: any) {
  const res = await fetch(`${API}/extras-filtered-reservation-outputs/generate/${fileId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return res.json();
} 