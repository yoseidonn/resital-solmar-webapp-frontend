import React, { useEffect, useState, useRef } from 'react';
import SummaryCard from '../components/SummaryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCareTakers } from '../services/careTakerService';
import { getVillas } from '../services/villaService';
import { getAPISReportFiles } from '../services/apisReportFileService';
import { getResortReportFiles } from '../services/resortReportFileService';
import { getAPISReportOutputs } from '../services/apisReportOutputService';
import { getResortReportOutputs } from '../services/resortReportOutputService';

// Utility to format date as dd/MM/yy
function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    caretakers: 0,
    villas: 0,
    apisFiles: 0,
    resortFiles: 0,
    apisOutputs: 0,
    resortOutputs: 0,
  });
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [recentOutputs, setRecentOutputs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [caretakers, villas, apisFiles, resortFiles, apisOutputs, resortOutputs] = await Promise.all([
          getCareTakers(),
          getVillas(),
          getAPISReportFiles(),
          getResortReportFiles(),
          getAPISReportOutputs(),
          getResortReportOutputs(),
        ]);
        setCounts({
          caretakers: caretakers.length,
          villas: villas.length,
          apisFiles: apisFiles.length,
          resortFiles: resortFiles.length,
          apisOutputs: apisOutputs.length,
          resortOutputs: resortOutputs.length,
        });
        setRecentFiles([
          ...apisFiles.map(f => ({ ...f, type: 'APIS' })),
          ...resortFiles.map(f => ({ ...f, type: 'Resort' })),
        ].sort((a, b) => Date.parse(b.uploaded_at || b.date || '') - Date.parse(a.uploaded_at || a.date || '')).slice(0, 3));
        setRecentOutputs([
          ...apisOutputs.map(o => ({ ...o, type: 'APIS' })),
          ...resortOutputs.map(o => ({ ...o, type: 'Resort' })),
        ].sort((a, b) => Date.parse(b.created_at || '') - Date.parse(a.created_at || '')).slice(0, 3));
      } catch (err: any) {
        setError('Failed to load dashboard data.');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleFileDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccess(null);
    setUploading(true);
    const file = e.target.files?.[0];
    if (!file) return;
    setLastFile(file);
    try {
      let uploadFn;
      if (file.name.toLowerCase().includes('apis')) {
        const mod = await import('../services/apisReportFileService');
        uploadFn = (file: File) => mod.createAPISReportFile({ file });
      } else if (file.name.toLowerCase().includes('resort')) {
        const mod = await import('../services/resortReportFileService');
        uploadFn = (file: File) => mod.createResortReportFile({ file });
      } else {
        throw new Error('Unknown file type. Filename must include "apis" or "resort".');
      }
      await uploadFn(file);
      setUploadSuccess('File uploaded successfully!');
      setLastFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    }
    setUploading(false);
  };

  const handleRetry = async () => {
    if (!lastFile) return;
    setUploadError(null);
    setUploadSuccess(null);
    setUploading(true);
    try {
      let uploadFn;
      if (lastFile.name.toLowerCase().includes('apis')) {
        const mod = await import('../services/apisReportFileService');
        uploadFn = (file: File) => mod.createAPISReportFile({ file });
      } else if (lastFile.name.toLowerCase().includes('resort')) {
        const mod = await import('../services/resortReportFileService');
        uploadFn = (file: File) => mod.createResortReportFile({ file });
      } else {
        throw new Error('Unknown file type. Filename must include "apis" or "resort".');
      }
      await uploadFn(lastFile);
      setUploadSuccess('File uploaded successfully!');
      setLastFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    }
    setUploading(false);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Dashboard</h2>
      {loading ? <LoadingSpinner /> : error ? <div className="alert alert-danger">{error}</div> : (
        <>
          <div className="row mb-4">
            <div className="col-md-3 col-6">
              <SummaryCard title="Caretakers" icon="bi-people" count={counts.caretakers} />
            </div>
            <div className="col-md-3 col-6">
              <SummaryCard title="Villas" icon="bi-house" count={counts.villas} />
            </div>
            <div className="col-md-3 col-6">
              <SummaryCard title="APIS Files" icon="bi-file-earmark-excel" count={counts.apisFiles} />
            </div>
            <div className="col-md-3 col-6">
              <SummaryCard title="Resort Files" icon="bi-file-earmark-spreadsheet" count={counts.resortFiles} />
            </div>
            <div className="col-md-3 col-6 mt-3">
              <SummaryCard title="APIS Outputs" icon="bi-file-earmark-bar-graph" count={counts.apisOutputs} />
            </div>
            <div className="col-md-3 col-6 mt-3">
              <SummaryCard title="Resort Outputs" icon="bi-file-earmark-bar-graph-fill" count={counts.resortOutputs} />
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h5>Upload Excel File</h5>
              <div className="d-flex align-items-center mb-2 gap-2">
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="form-control" onChange={handleFileDrop} disabled={uploading} />
                {lastFile && uploadError && (
                  <button className="btn btn-warning" onClick={handleRetry} disabled={uploading} type="button">
                    Retry
                  </button>
                )}
              </div>
              {uploading && <LoadingSpinner />}
              {uploadError && <div className="alert alert-danger mt-2">{uploadError}</div>}
              {uploadSuccess && <div className="alert alert-success mt-2">{uploadSuccess}</div>}
              <div className="form-text">Filename must include "apis" or "resort" to select the correct upload endpoint.</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h5>Recent Files</h5>
                  <ul className="list-group">
                    {recentFiles.length === 0 ? <li className="list-group-item text-muted">No recent files</li> : recentFiles.map((f: any) => (
                      <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span><i className={f.type === 'APIS' ? 'bi bi-file-earmark-excel text-success' : 'bi bi-file-earmark-spreadsheet text-info'}></i> {f.file_name || f.name || f.id}</span>
                        <span className="badge bg-secondary">{f.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h5>Recent Outputs</h5>
                  <ul className="list-group">
                    {recentOutputs.length === 0 ? <li className="list-group-item text-muted">No recent outputs</li> : recentOutputs.map((o: any) => (
                      <li key={o.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span><i className={o.type === 'APIS' ? 'bi bi-file-earmark-bar-graph text-success' : 'bi bi-file-earmark-bar-graph-fill text-info'}></i> {formatDate(o.created_at)}</span>
                        <span className="badge bg-secondary">{o.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 