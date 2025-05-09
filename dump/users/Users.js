import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Row, Col, Button, Form, Table,
  Modal, Card, Badge, Tooltip, OverlayTrigger, Alert, Spinner
} from 'react-bootstrap';
import { Plus, Pencil, Trash, House, ThermometerHalf, TruckFlatbed, GiftFill, Check, Upload, Download, People } from 'react-bootstrap-icons';
import { storageService } from '../services/storageService';
import UserSummaryCard from '../components/users/UserSummaryCard';
import UserListTable from '../components/users/UserListTable';
import UserModal from '../components/users/UserModal';
import { useRequestStatus } from '../context/RequestStatusContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const CACHED_USERS_KEY = 'cachedUsersList';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [villas, setVillas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    villaRules: {}
  });
  const [loading, setLoading] = useState(false);
  // Alert mesajı
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('info');
  // JSON yükleme ve indirme için
  const fileInputRef = useRef(null);
  const { reportSuccess, reportFail, lastError } = useRequestStatus();
  const online = useOnlineStatus();
  const [errorDismissed, setErrorDismissed] = useState(false);

  // Utility function for syncing users
  const syncUsers = async (setUsers) => {
    let users = [];
    if (online) {
      users = await storageService.getUsers();
      localStorage.setItem(CACHED_USERS_KEY, JSON.stringify(users));
    } else {
      const cached = localStorage.getItem(CACHED_USERS_KEY);
      users = cached ? JSON.parse(cached) : [];
    }
    setUsers([...users].sort((a, b) => a.name.localeCompare(b.name, 'tr')));
  };

  useEffect(() => {
    syncUsers(setUsers);
    loadVillas();
  }, [online]);

  useEffect(() => {
    if (lastError) setErrorDismissed(false);
  }, [lastError]);

  const loadVillas = async () => {
    setLoading(true);
    try {
      const savedVillas = await storageService.getVillas();
      const sortedVillas = [...savedVillas].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    setVillas(sortedVillas);
      reportSuccess();
    } catch (error) {
      reportFail(error);
      let msg = error?.message || error;
      setAlertType('danger');
      setAlertMessage('Villalar yüklenemedi: ' + msg);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // Form değişikliği
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Villa seçim değişikliği
  const handleVillaChange = (villa) => {
    const villaName = villa.name;
    const villaRules = { ...formValues.villaRules };
    if (villaRules[villaName]) {
      delete villaRules[villaName];
    } else {
      villaRules[villaName] = {
        showPoolHeating: false,
        showCot: false,
        showWelcomePack: false
      };
    }
    setFormValues({
      ...formValues,
      villaRules
    });
  };

  // Ekstra değişikliği
  const handleExtraChange = (villaName, extraName, checked) => {
    const villaRules = { ...formValues.villaRules };
    if (!villaRules[villaName]) {
      villaRules[villaName] = {
        showPoolHeating: false,
        showCot: false,
        showWelcomePack: false
      };
    }
    villaRules[villaName][extraName] = checked;
    setFormValues({
      ...formValues,
      villaRules
    });
  };

  // Bir villanın tüm ekstralarını seç/kaldır
  const handleToggleAllExtrasForVilla = (villaName) => {
    const villaRules = { ...formValues.villaRules };
    if (!villaRules[villaName]) {
      villaRules[villaName] = {
        showPoolHeating: false,
        showCot: false,
        showWelcomePack: false
      };
    }
    const allSelected = 
      villaRules[villaName].showPoolHeating && 
      villaRules[villaName].showCot && 
      villaRules[villaName].showWelcomePack;
    villaRules[villaName] = {
      showPoolHeating: !allSelected,
      showCot: !allSelected,
      showWelcomePack: !allSelected
    };
    setFormValues({
      ...formValues,
      villaRules
    });
  };

  // Tüm villaları seç/kaldır
  const handleToggleAllVillas = () => {
    const allVillaRules = {};
    if (Object.keys(formValues.villaRules).length === villas.length) {
      setFormValues({
        ...formValues,
        villaRules: {}
      });
    } else {
      villas.forEach(villa => {
        allVillaRules[villa.name] = {
          showPoolHeating: false,
          showCot: false,
          showWelcomePack: false
        };
      });
      setFormValues({
        ...formValues,
        villaRules: allVillaRules
      });
    }
  };

  // Yeni kullanıcı oluştur
  const handleCreate = () => {
    setIsEditing(false);
    setFormValues({
      name: '',
      villaRules: {}
    });
    setCurrentUser(null);
    setShowModal(true);
  };

  // Kullanıcı düzenle
  const handleEdit = (user) => {
    setIsEditing(true);
    setFormValues({
      name: user.name || '',
      villaRules: user.villaRules || {}
    });
    setCurrentUser(user);
    setShowModal(true);
  };

  // Kullanıcı kaydet
  const handleSave = async () => {
    if (!formValues.name.trim()) {
      setAlertType('danger');
      setAlertMessage('Lütfen kullanıcı adı girin');
      setShowAlert(true);
      return;
    }
    setLoading(true);
    try {
      const userData = {
        id: (currentUser?.id || undefined),
        name: formValues.name.trim(),
        villaRules: formValues.villaRules || {},
        createdAt: currentUser?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (isEditing && userData.id) {
        await storageService.updateUser(userData.id, userData);
        setAlertMessage('Kullanıcı güncellendi');
      } else {
        await storageService.createUser(userData);
        setAlertMessage('Kullanıcı oluşturuldu');
      }
      setAlertType('success');
      setShowAlert(true);
      await syncUsers(setUsers);
      setShowModal(false);
      reportSuccess();
    } catch (error) {
      reportFail(error);
      setAlertMessage(`Hata: ${error.message}`);
      setAlertType('danger');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı sil
  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      await storageService.deleteUser(userId);
      await syncUsers(setUsers);
      setAlertMessage('Kullanıcı silindi');
      setAlertType('success');
      setShowAlert(true);
      reportSuccess();
    } catch (error) {
      reportFail(error);
      setAlertMessage(`Hata: ${error.message}`);
      setAlertType('danger');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // JSON dosyasını indirme
  const handleExportJson = async () => {
    setLoading(true);
    try {
      const userData = await storageService.getUsers();
      const exportData = userData.map(user => {
        const userVillas = [];
        if (user.villaAssignments && user.villaAssignments.length > 0) {
          user.villaAssignments.forEach(assignment => {
            const villaName = assignment.villaName;
            const extras = [];
            if (user.villaRules && user.villaRules[villaName]) {
              const rules = user.villaRules[villaName];
              if (rules.showPoolHeating) extras.push("pool-heating");
              if (rules.showCot) extras.push("complementary-cot");
              if (rules.showWelcomePack) extras.push("welcome-pack");
            }
            userVillas.push({
              name: villaName,
              extras: extras
            });
          });
        }
        return {
          name: user.name,
          villas: userVillas
        };
      });
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kullanicilar.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setAlertMessage('Kullanıcılar başarıyla JSON olarak indirildi');
      setAlertType('success');
      setShowAlert(true);
      reportSuccess();
    } catch (error) {
      reportFail(error);
      setAlertMessage(`Dışa aktarma hatası: ${error.message}`);
      setAlertType('danger');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };
  
  // JSON dosyasını yükleme
  const handleImportJson = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setAlertMessage('Lütfen sadece JSON dosyası yükleyin');
      setAlertType('danger');
      setShowAlert(true);
      return;
    }
    setLoading(true);
      try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
        if (!Array.isArray(jsonData)) {
          throw new Error('JSON dosyası kullanıcı dizisi içermelidir');
        }
      const existingUsers = await storageService.getUsers();
        let processedUsers = 0;
        let updatedUsers = 0;
        let newUsers = 0;
      const processedNames = new Set();
        for (const item of jsonData) {
        if (!item.name || typeof item.name !== 'string') continue;
            const userName = item.name.trim();
        if (processedNames.has(userName.toLowerCase())) continue;
            processedNames.add(userName.toLowerCase());
        const existingUser = existingUsers.find(u => u.name.toLowerCase() === userName.toLowerCase());
            const villaAssignments = [];
            const villaRules = {};
            if (Array.isArray(item.villas)) {
              item.villas.forEach(villaItem => {
                if (!villaItem.name) return;
                const villaName = villaItem.name.trim();
            const villa = villas.find(v => v.name.toLowerCase() === villaName.toLowerCase());
            if (!villa) return;
                villaAssignments.push({
                  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                  villaName: villa.name,
                  userName: userName
                });
                villaRules[villa.name] = {
                  showPoolHeating: Array.isArray(villaItem.extras) && villaItem.extras.includes("pool-heating"),
                  showCot: Array.isArray(villaItem.extras) && villaItem.extras.includes("complementary-cot"),
                  showWelcomePack: Array.isArray(villaItem.extras) && villaItem.extras.includes("welcome-pack")
                };
              });
            }
            if (existingUser) {
          await storageService.updateUser(existingUser.id, {
                  ...existingUser,
                  name: userName,
                  villaAssignments,
                  villaRules
              });
              updatedUsers++;
            } else {
          await storageService.createUser({
                  name: userName,
                  villaAssignments,
                  villaRules
              });
              newUsers++;
            }
            processedUsers++;
      }
          setAlertMessage(`${processedUsers} kullanıcı işlendi. ${newUsers} yeni kullanıcı eklendi, ${updatedUsers} kullanıcı güncellendi.`);
          setAlertType('success');
      await syncUsers(setUsers);
      reportSuccess();
      } catch (error) {
      reportFail(error);
        setAlertMessage(`Dosya işleme hatası: ${error.message}`);
      setAlertType('danger');
    } finally {
      setShowAlert(true);
      setLoading(false);
      e.target.value = null;
    }
  };

  return (
    <Container fluid className="p-4">
      {lastError && !errorDismissed && (
        <Alert variant="danger" dismissible onClose={() => setErrorDismissed(true)}>
          {lastError.includes('permission') ? 'Yetersiz yetki: ' : ''}
          {lastError.includes('network') ? 'Ağ hatası: ' : ''}
          {lastError.includes('offline') ? 'Çevrimdışı: ' : ''}
          {lastError.includes('user') || lastError.includes('profil') ? 'Kullanıcılar yüklenemedi: ' : ''}
          {lastError.includes('villa') ? 'Villalar yüklenemedi: ' : ''}
          {lastError}
        </Alert>
      )}
      {showAlert && (
        <Alert 
          variant={alertType} 
          dismissible 
          onClose={() => setShowAlert(false)}
          className="mb-4"
        >
          {alertMessage}
        </Alert>
      )}
      {loading && (
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Spinner animation="border" variant="primary" />
                </div>
              )}
      <UserSummaryCard userCount={users.length} />
      <UserListTable
        users={users}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleExportJson={handleExportJson}
        handleImportJson={handleImportJson}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleCreate={handleCreate}
      />
      <UserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        isEditing={isEditing}
        formValues={formValues}
        handleChange={handleChange}
        villas={villas}
        handleVillaChange={handleVillaChange}
        handleExtraChange={handleExtraChange}
        handleToggleAllExtrasForVilla={handleToggleAllExtrasForVilla}
        handleToggleAllVillas={handleToggleAllVillas}
        handleSave={handleSave}
      />
    </Container>
  );
};

export default Users;