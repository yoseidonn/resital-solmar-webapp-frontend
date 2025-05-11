import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

interface SidebarTab {
  label: string;
  to: string;
  iconClass?: string; // e.g., 'bi-house'
}

interface SidebarProps {
  children: React.ReactNode;
  tabs: SidebarTab[];
}

const Sidebar: React.FC<SidebarProps> = ({ children, tabs }) => {
  const location = useLocation();
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <span className="fs-5 d-none d-sm-inline">Menu</span>
            </Link>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.to} style={{ width: '100%' }}>
                  <Link
                    to={tab.to}
                    className={`nav-link align-middle px-0 text-white${location.pathname === tab.to ? ' active bg-primary' : ''}`}
                  >
                    {tab.iconClass && <i className={`fs-4 ${tab.iconClass}`} style={{ verticalAlign: 'middle' }}></i>}
                    <span className="ms-1 d-none d-sm-inline" style={{ verticalAlign: 'middle' }}>{tab.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col py-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export type { SidebarTab };
export default Sidebar;

