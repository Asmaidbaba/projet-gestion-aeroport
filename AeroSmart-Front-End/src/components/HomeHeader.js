import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HomeHeader.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Accueil' },
    { path: '/login', label: 'Se Connecter' },
    { path: '/register', label: "S'inscrire" },
    { path: '/contact', label: 'Contact' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="aerosmart-header">
      <nav className="aerosmart-navbar">
        {/* Logo Section */}
        <div className="aerosmart-logo-container">
          <img 
            src="/images/logo.png" 
            alt="AeroSmart Logo" 
            className="aerosmart-logo-image"
          />
          <Link to="/" className="aerosmart-logo" onClick={closeMobileMenu}>
            AeroSmart
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className={`aerosmart-nav-links ${isMobileMenuOpen ? 'aerosmart-nav-links-mobile' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path} className="aerosmart-nav-item">
              <Link
                to={item.path}
                className={`aerosmart-nav-link ${
                  isActiveLink(item.path) ? 'aerosmart-nav-link-active' : ''
                }`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className={`aerosmart-mobile-menu-button ${isMobileMenuOpen ? 'aerosmart-mobile-menu-button-open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="aerosmart-hamburger-line"></span>
          <span className="aerosmart-hamburger-line"></span>
          <span className="aerosmart-hamburger-line"></span>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="aerosmart-mobile-overlay"
            onClick={closeMobileMenu}
          />
        )}
      </nav>
    </header>
  );
};

export default Header;