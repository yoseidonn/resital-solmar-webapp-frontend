import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CareTakers from './pages/CareTakers';
import Villas from './pages/Villas';
import GenerateOutputs from './pages/GenerateOutputs';
import FileHistory from './pages/FileHistory';
import OutputHistory from './pages/OutputHistory';
import BackupRecovery from './pages/BackupRecovery';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/care-takers" element={<CareTakers />} />
            <Route path="/villas" element={<Villas />} />
            <Route path="/generate-outputs" element={<GenerateOutputs />} />
            <Route path="/file-history" element={<FileHistory />} />
            <Route path="/output-history" element={<OutputHistory />} />
            <Route path="/backup-recovery" element={<BackupRecovery />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
