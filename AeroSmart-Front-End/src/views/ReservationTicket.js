import React from "react";
import "../styles/ReservationTicket.css";

export default function ReservationTicket() {
  const handleBackToFlights = () => {
    console.log('Retour aux vols');
    // Navigation vers la page précédente
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reservation-page">
      {/* 🔵 Barre de navigation en bleu */}
      <header className="billet-header">
        <nav className="billet-nav">
          <div className="billet-logo-container">
            <img 
              src="/images/logo.png" 
              alt="AeroSmart Logo" 
              className="billet-logo-image"
            />
            <div className="billet-logo">AeroSmart</div>
          </div>
          
          <h1 className="billet-title">Billet de Réservation</h1>
          
          <div className="billet-actions">
            <button 
              className="billet-back-button"
              onClick={handleBackToFlights}
            >
              <span>←</span>
              Retour
            </button>
            <button 
              className="billet-print-button"
              onClick={handlePrint}
            >
              <span>🖨️</span>
              Imprimer
            </button>
          </div>
        </nav>
      </header>

      {/* 📋 Contenu principal sur toute la page, aligné à gauche */}
      <div className="ticket-container">

        {/* Informations passager */}
        <div className="ticket-section">
          <h2 className="section-title">Vos Informations</h2>
          <div className="info-grid">
            <div>
              <strong>Nom :</strong> Passager 01
            </div>
            <div>
              <strong>Email :</strong> passager@email.com
            </div>
            <div>
              <strong>Numéro de réservation :</strong> RS12345
            </div>
          </div>
        </div>

        {/* Détails du vol */}
        <div className="ticket-section">
          <h2 className="section-title">Détails du vol</h2>
          <div className="flight-route">
            <span className="city">Casablanca</span>
            <span className="arrow">→</span>
            <span className="city">Agadir</span>
          </div>
          <div className="flight-details-grid">
            <div>
              <strong>Date :</strong> 25 Octobre 2025
            </div>
            <div>
              <strong>Heure :</strong> 10h45
            </div>
            <div>
              <strong>Compagnie :</strong> AeroSmart
            </div>
          </div>
          <div className="status">
            <span className="status-label">Status :</span>
            <span className="status-confirmed">Confirmée</span>
          </div>
        </div>

        {/* Bagages inclus */}
        <div className="ticket-section">
          <h2 className="section-title">Bagages inclus</h2>

          <div className="baggage-table">
            <div className="baggage-column">
              <h3>Standard</h3>
              <p>1x Bagage cabine (10kg)</p>
              <p>1x Bagage à main</p>
            </div>

            <div className="baggage-column">
              <h3>Supplémentaire</h3>
              <p>1x Bagage 23kg</p>
              <p>+120 MAD</p>
            </div>

            <div className="baggage-column">
              <h3>Excédent</h3>
              <p>1x Bagage en surpoids (max 32kg)</p>
              <p>+180 MAD</p>
            </div>
          </div>
        </div>

        {/* Prix total */}
        <div className="total-section">
          <span className="total-label">Prix total</span>
          <span className="total-value">680 MAD</span>
        </div>
      </div>
    </div>
  );
}