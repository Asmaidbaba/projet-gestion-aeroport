import React from 'react';
import './Header.css';

const Header = ({ currentStep = 1 }) => {
  return (
    <header className="booking-header">
      <nav className="booking-navbar">
        <div className="booking-logo-container">
          <img 
            src="/images/logo.png" 
            alt="AeroSmart Logo" 
            className="booking-logo-image"
          />
          <div className="booking-logo">AeroSmart</div>
        </div>
        
        <div className="booking-steps-container">
          <div className={`booking-step ${currentStep === 1 ? 'booking-step-active' : ''}`}>
            <div className="booking-step-number">1</div>
            <div className="booking-step-label">Sélectionnez les vols</div>
          </div>
          <div className={`booking-step ${currentStep === 2 ? 'booking-step-active' : ''}`}>
            <div className="booking-step-number">2</div>
            <div className="booking-step-label">Informations du vol</div>
          </div>
          <div className={`booking-step ${currentStep === 3 ? 'booking-step-active' : ''}`}>
            <div className="booking-step-number">3</div>
            <div className="booking-step-label">Compléter la réservation</div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;