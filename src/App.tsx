import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from './components/Sidebar';
import type { SidebarTab } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CareTakers from './pages/CareTakers';
import Villas from './pages/Villas';
import GenerateOutputs from './pages/GenerateOutputs';
import FileHistory from './pages/FileHistory';
import OutputHistory from './pages/OutputHistory';
import BackupRecovery from './pages/BackupRecovery';
import './App.css';

const sidebarTabs: SidebarTab[] = [
  { label: 'Dashboard', to: '/', iconClass: 'bi-speedometer2' },
  { label: 'Villas', to: '/villas', iconClass: 'bi-house' },
  { label: 'Care Takers', to: '/care-takers', iconClass: 'bi-people' },
  { label: 'File History', to: '/file-history', iconClass: 'bi-clock-history' },
  { label: 'Output History', to: '/output-history', iconClass: 'bi-list-check' },
  { label: 'Backup & Recovery', to: '/backup-recovery', iconClass: 'bi-cloud-arrow-up' },
];

function App() {
  return (
    <Router>
      <div className="d-flex flex-row vh-100 w-100">
        <Sidebar tabs={sidebarTabs}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/care-takers" element={<CareTakers />} />
            <Route path="/villas" element={<Villas />} />
            <Route path="/generate-outputs" element={<GenerateOutputs />} />
            <Route path="/file-history" element={<FileHistory />} />
            <Route path="/output-history" element={<OutputHistory />} />
            <Route path="/backup-recovery" element={<BackupRecovery />} />
          </Routes>
        </Sidebar>
      </div>
    </Router>
  );
}

export default App;
