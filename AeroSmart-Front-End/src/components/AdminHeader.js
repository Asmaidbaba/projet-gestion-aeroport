import React from 'react';
import './AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <nav className="admin-nav">
        <div className="admin-logo-container">
          <img 
            src="/images/logo.png" 
            alt="AeroSmart Logo" 
            className="admin-logo-image"
          />
          <div className="admin-logo">AeroSmart</div>
        </div>
        <div className="admin-nav-section">
          <a href="/disponiblevols" className="admin-nav-link">Vols disponibles</a>
          <a href="/addvol" className="admin-nav-link">Ajouter vol</a>
          <a href="/confirmation" className="admin-nav-link">Confirmation</a>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;