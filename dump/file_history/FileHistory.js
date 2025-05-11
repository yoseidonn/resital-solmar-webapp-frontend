import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Button, Table, Card, Tabs, Tab,
  Modal, Alert, Badge, ListGroup, ButtonGroup, Spinner
} from 'react-bootstrap';
import { 
  Trash, Download, Eye, FileEarmark, FileText
} from 'react-bootstrap-icons';
import { firebaseService } from '../services/firebaseService';
import BackupRestoreModal from '../components/BackupRestoreModal';
import FileListCard from '../components/fileHistory/FileListCard';
import ReportListCard from '../components/fileHistory/ReportListCard';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useRequestStatus } from '../context/RequestStatusContext';
import OutputDetailsModal from '../components/dashboard/OutputDetailsModal';
import UploadedReservationFilesList from '../components/dashboard/UploadedReservationFilesList';
import UploadedApisFilesList from '../components/dashboard/UploadedApisFilesList';
import GeneratedReservationReportsList from '../components/dashboard/GeneratedReservationReportsList';
import GeneratedApisReportsList from '../components/dashboard/GeneratedApisReportsList';
import { reservationFileService } from '../services/reservationFileService';
import { reservationReportService } from '../services/reservationReportService';
import { apisFileService } from '../services/apisFileService';
import { apisReportService } from '../services/apisReportService';

const FileHistory = () => {
  const [reservationFiles, setReservationFiles] = useState([]);
  const [reservationReports, setReservationReports] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentOutput, setCurrentOutput] = useState(null);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [showOutputDialog, setShowOutputDialog] = useState(false);
  const [tabKey, setTabKey] = useState('files');
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('info');
  const [showAlert, setShowAlert] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const online = useOnlineStatus();
  const { reportSuccess, reportFail, lastError } = useRequestStatus();
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [apisFiles, setApisFiles] = useState([]);
  const [apisReports, setApisReports] = useState([]);

  useEffect(() => {
    loadFiles();
    loadOutputs();
    loadReservationFiles();
    loadReservationReports();
    loadApisFiles();
    loadApisReports();
  }, []);

  useEffect(() => {
    if (lastError) setErrorDismissed(false);
  }, [lastError]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      let fileList = [];
      if (online && firebaseService && firebaseService.storage && firebaseService.storage._delegate) {
        const { ref, listAll, getMetadata } = await import('firebase/storage');
        const storage = firebaseService.storage || (await import('../firebase')).storage;
        const folderRef = ref(storage, 'excel_files');
        const res = await listAll(folderRef);
        fileList = await Promise.all(res.items.map(async (itemRef) => {
          const meta = await getMetadata(itemRef);
          return {
            id: itemRef.name,
            name: itemRef.name,
            size: meta.size,
            uploadDate: meta.timeCreated,
          };
        }));
      }
      const sortedFiles = [...fileList].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      setReservationFiles(sortedFiles);
      reportSuccess();
    } catch (error) {
      reportFail(error);
      setAlertType('danger');
      setAlertMessage('Rezervasyon dosyaları yüklenemedi: ' + (error?.message || error));
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const loadOutputs = async () => {
    setLoading(true);
    try {
      const savedOutputs = await firebaseService.getOutputs();
      const sortedOutputs = [...savedOutputs].sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate));
    setReservationReports(sortedOutputs);
      reportSuccess();
    } catch (error) {
      reportFail(error);
      setAlertType('danger');
      setAlertMessage('Raporlar yüklenemedi: ' + error.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };


  const loadReservationFiles = () => {
    const files = reservationFileService.getCachedReservationFiles();
    setReservationFiles([...files].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
  }; 

  const loadReservationReports = () => {
    const reports = reservationReportService.getReservationReports();
    setReservationReports([...reports].sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate)));
  };

  const loadApisFiles = () => {
    const files = apisFileService.getCachedApisFiles();
    setApisFiles([...files].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
  };

  const loadApisReports = () => {
    const reports = apisReportService.getApisReports();
    setApisReports([...reports].sort((a, b) => new Date(b.generatedDate) - new Date(a.generatedDate)));
  };

  const handleTabChange = (key) => {
    setTabKey(key);
  };

  const viewFileDetails = async (fileId) => {
    setLoading(true);
    try {
      const selectedFile = reservationFiles.find(f => f.id === fileId);
    setCurrentFile(selectedFile);
    setShowFileDialog(true);
      reportSuccess();
    } catch (error) {
      reportFail(error);
    } finally {
      setLoading(false);
    }
  };

  const viewOutputDetails = async (outputId) => {
    setLoading(true);
    try {
      const output = await firebaseService.getOutputById(outputId);
    setCurrentOutput(output);
    setShowOutputDialog(true);
      reportSuccess();
    } catch (error) {
      reportFail(error);
    } finally {
      setLoading(false);
    }
  };

  const viewApisReport = (report) => {
    setCurrentOutput(report);
    setShowOutputDialog(true);
  };

  const handleDeleteFile = async (fileId) => {
    setLoading(true);
    try {
    const relatedOutputs = reservationReports.filter(output => output.fileId === fileId);
    if (relatedOutputs.length > 0) {
      setAlertType('danger');
      setAlertMessage('Bu dosya ile oluşturulmuş raporlar var. Önce raporları silmelisiniz.');
      setShowAlert(true);
      return;
    }
      const { ref, deleteObject } = await import('firebase/storage');
      const storage = firebaseService.storage || (await import('../firebase')).storage;
      const fileRef = ref(storage, `excel_files/${fileId}`);
      await deleteObject(fileRef);
      await loadFiles();
    setAlertType('success');
    setAlertMessage('Dosya başarıyla silindi.');
    setShowAlert(true);
      reportSuccess();
    } catch (error) {
      reportFail(error);
      setAlertType('danger');
      setAlertMessage('Dosya silinemedi: ' + error.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutput = async (outputId) => {
    setLoading(true);
    try {
      await firebaseService.deleteOutput(outputId);
      await loadOutputs();
    setAlertType('success');
    setAlertMessage('Rapor başarıyla silindi.');
    setShowAlert(true);
    if (showOutputDialog && currentOutput && currentOutput.id === outputId) {
      setShowOutputDialog(false);
    }
      reportSuccess();
    } catch (error) {
      reportFail(error);
      setAlertType('danger');
      setAlertMessage('Rapor silinemedi: ' + error.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const downloadFileData = async (file) => {
    setLoading(true);
    try {
      const url = await firebaseService.downloadExcelFile(file.name);
    const a = document.createElement('a');
    a.href = url;
      a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
      reportSuccess();
    } catch (error) {
      reportFail(error);
      setAlertType('danger');
      setAlertMessage('Dosya indirilemedi: ' + error.message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const downloadOutputText = (output) => {
    let outputText = '';
    if (Array.isArray(output.selectedUserIds)) {
      outputText += `Profiller: ${output.profileNames}\n`;
    } else {
      outputText += `Profil: ${output.profileName}\n`;
    }
    outputText += `Dosya: ${output.fileName}\n`;
    outputText += `Oluşturma Tarihi: ${new Date(output.generatedDate).toLocaleString('tr-TR')}\n\n`;
    Object.entries(output.messages)
      .sort(([userA], [userB]) => userA.localeCompare(userB, 'tr'))
      .forEach(([user, message]) => {
        outputText += `--- ${user} ---\n\n`;
        outputText += `${message}\n\n`;
      });
    const dataBlob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date(output.generatedDate);
    const dateStr = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    const timeStr = `${date.getHours()}-${date.getMinutes()}`;
    const reportId = output.id.substring(0, 6);
    a.download = `Solmar_Rapor_${dateStr}_${timeStr}_${reportId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadOutputJson = (output) => {
    try {
      const outputJson = {};
      const sortedUsers = Object.keys(output.messages).sort((a, b) => a.localeCompare(b, 'tr'));
      sortedUsers.forEach(user => {
        outputJson[user] = output.messages[user];
      });
      const jsonString = JSON.stringify(outputJson, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date(output.generatedDate);
      const dateStr = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
      const timeStr = `${date.getHours()}-${date.getMinutes()}`;
      const reportId = output.id.substring(0, 6);
      a.download = `Solmar_Rapor_${dateStr}_${timeStr}_${reportId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setAlertMessage('Rapor başarıyla JSON olarak indirildi');
      setAlertType('success');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage(`Dışa aktarma hatası: ${error.message}`);
      setAlertType('danger');
      setShowAlert(true);
    }
  };

  const downloadReservationReportText = (report) => {
    let outputText = '';
    if (Array.isArray(report.selectedUserIds)) {
      outputText += `Profiller: ${report.profileNames}\n`;
    } else {
      outputText += `Profil: ${report.profileName}\n`;
    }
    outputText += `Dosya: ${report.fileName}\n`;
    outputText += `Oluşturma Tarihi: ${new Date(report.generatedDate).toLocaleString('tr-TR')}\n\n`;
    Object.entries(report.messages)
      .sort(([a], [b]) => a.localeCompare(b, 'tr'))
      .forEach(([user, message]) => {
        outputText += `--- ${user} ---\n\n${message}\n\n`;
      });
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date(report.generatedDate);
    const dateStr = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    const timeStr = `${date.getHours()}-${date.getMinutes()}`;
    const reportId = report.id.substring(0, 6);
    a.download = `Solmar_Rapor_${dateStr}_${timeStr}_${reportId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadReservationReportJson = (report) => {
    try {
      const outputJson = {};
      const sortedUsers = Object.keys(report.messages).sort((a, b) => a.localeCompare(b, 'tr'));
      sortedUsers.forEach(user => {
        outputJson[user] = report.messages[user];
      });
      const jsonString = JSON.stringify(outputJson, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date(report.generatedDate);
      const dateStr = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
      const timeStr = `${date.getHours()}-${date.getMinutes()}`;
      const reportId = report.id.substring(0, 6);
      a.download = `Solmar_Rapor_${dateStr}_${timeStr}_${reportId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setAlertMessage(`Dışa aktarma hatası: ${error.message}`);
      setAlertType('danger');
      setShowAlert(true);
    }
  };

  const downloadReservationReportExcel = (report) => {
    const XLSX = require('xlsx');
    const rows = Object.entries(report.messages).map(([user, message]) => ({ Kullanıcı: user, Mesaj: message }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rezervasyon');
    const date = new Date(report.generatedDate);
    const dateStr = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
    const fileName = `Rezervasyon_Raporu_${dateStr}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const downloadApisReportExcel = (report) => {
    const XLSX = require('xlsx');
    const ws = XLSX.utils.json_to_sheet(report.rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'APIS');
    const datePart = report.date?.replace?.(/\//g, '-') || 'tarih';
    const villaShort = report.villa?.replace?.(/^Villa\\s*/i, '') || 'villa';
    const fileName = `APIS_Report_${villaShort}_${datePart}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const downloadApisReportJson = (report) => {
    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `APIS_Raporu_${report.villa}_${report.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-3">
        <Col>
          <h2>Dosya Geçmişi</h2>
        </Col>
        <Col className="text-end">
          <Button variant="outline-primary" onClick={() => setShowBackupModal(true)}>
            Backup & Restore
          </Button>
        </Col>
      </Row>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Tabs
            activeKey={tabKey}
            onSelect={handleTabChange}
            className="mb-4"
            justify
          >
            <Tab eventKey="files" title={`Excel Dosyaları (${reservationFiles.length + apisFiles.length})`}>
              <UploadedReservationFilesList
                reservationFiles={reservationFiles}
                handleDeleteFile={handleDeleteFile}
                selectedFile={currentFile?.id}
                listMaxHeight={220}
              />
              <UploadedApisFilesList
                apisFiles={apisFiles}
                handleDeleteFile={handleDeleteFile}
                selectedFile={currentFile?.id}
                listMaxHeight={220}
              />
            </Tab>
            <Tab eventKey="outputs" title={`Oluşturulan Raporlar (${reservationReports.length + apisReports.length})`}>
              <GeneratedReservationReportsList
                reservationReports={reservationReports}
                viewReservationReport={viewOutputDetails}
                downloadOutputText={downloadReservationReportText}
                downloadOutputJson={downloadReservationReportJson}
                downloadReportExcel={downloadReservationReportExcel}
                listMaxHeight={220}
              />
              <GeneratedApisReportsList
                apisReports={apisReports}
                viewReport={viewApisReport}
                downloadReportExcel={downloadApisReportExcel}
                downloadReportJson={downloadApisReportJson}
                listMaxHeight={220}
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      <Modal show={showFileDialog} onHide={() => setShowFileDialog(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentFile?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFile && (
            <>
              <div className="mb-4">
                <p><strong>Yükleme Tarihi:</strong> {new Date(currentFile.uploadDate).toLocaleString('tr-TR')}</p>
                <p><strong>Boyut:</strong> {(currentFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFileDialog(false)}>
            Kapat
          </Button>
          <Button 
            variant="primary" 
            onClick={() => downloadFileData(currentFile)}
          >
            <Download className="me-1" /> Dosyayı İndir
          </Button>
        </Modal.Footer>
      </Modal>
      <OutputDetailsModal
        show={showOutputDialog}
        onHide={() => setShowOutputDialog(false)}
        currentOutput={currentOutput}
        downloadOutputText={downloadOutputText}
        downloadOutputJson={downloadOutputJson}
      />
      <BackupRestoreModal show={showBackupModal} onHide={() => setShowBackupModal(false)} />
    </Container>
  );
};

export default FileHistory;
