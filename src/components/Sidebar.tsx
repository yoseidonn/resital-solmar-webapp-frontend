import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
  <nav className="sidebar">
    <ul>
      <li><NavLink to="/" end>Dashboard</NavLink></li>
      <li><NavLink to="/care-takers">Care Takers</NavLink></li>
      <li><NavLink to="/villas">Villas</NavLink></li>
      <li><NavLink to="/generate-outputs">Generate Outputs</NavLink></li>
      <li><NavLink to="/file-history">File History</NavLink></li>
      <li><NavLink to="/output-history">Output History</NavLink></li>
      <li><NavLink to="/backup-recovery">Backup & Recovery</NavLink></li>
    </ul>
  </nav>
);

export default Sidebar; 