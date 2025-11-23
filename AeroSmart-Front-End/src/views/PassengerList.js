import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PassengerList.css';
import AdminHeader from '../components/AdminHeader';

const PassengerList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer les données du vol depuis la navigation
  const flightData = location.state?.flight || {
    flightNumber: "Y12B",
    date: "19/10/2025", 
    time: "12:45"
  };

  const [passengers, setPassengers] = useState([
    {
      id: 1,
      name: "Asma idbaba",
      identityNumber: "SE666",
      payment: "Payé",
      status: "En attente"
    },
    {
      id: 2,
      name: "Itham akarid",
      identityNumber: "JY56",
      payment: "Non payé",
      status: "En attente"
    },
    {
      id: 3,
      name: "sophia kama!",
      identityNumber: "GH45",
      payment: "Payé",
      status: "En attente"
    },
    {
      id: 4,
      name: "Aissam kama!",
      identityNumber: "DY54",
      payment: "Non payé",
      status: "En attente"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleCheck = (passengerId) => {
    console.log('Vérifier le passager:', passengerId);
    // Logique pour vérifier le passager
    setPassengers(passengers.map(passenger => 
      passenger.id === passengerId 
        ? { ...passenger, status: "Confirmé" }
        : passenger
    ));
  };

  const handleDelete = (passengerId) => {
    console.log('Supprimer le passager:', passengerId);
    // Logique pour supprimer le passager
    setPassengers(passengers.filter(passenger => passenger.id !== passengerId));
  };

  const handleBackToFlights = () => {
    console.log('Retour à la liste des vols');
    navigate('/confirmation'); // Retour à la page de confirmation
  };

  // Filtrer les passagers basé sur la recherche
  const filteredPassengers = passengers.filter(passenger =>
    passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passenger.identityNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passenger.payment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="passenger-list-page">
      {/* Admin Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className="passenger-main">
        <div className="passenger-container">
          
          {/* Page Title and Back Button */}
          <div className="page-header-section">
            <div className="header-top">
              <button 
                className="back-button"
                onClick={handleBackToFlights}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour aux vols
              </button>
              <h2>Liste des Passagers</h2>
            </div>
            
            {/* Flight Information Card */}
            <div className="flight-info-card">
              <div className="flight-info-content">
                <div className="flight-info-item">
                  <span className="flight-info-label">Vol</span>
                  <span className="flight-info-value">{flightData.flightNumber}</span>
                </div>
                <div className="flight-info-item">
                  <span className="flight-info-label">Date</span>
                  <span className="flight-info-value">{flightData.date}</span>
                </div>
                <div className="flight-info-item">
                  <span className="flight-info-label">Heure</span>
                  <span className="flight-info-value">{flightData.time}</span>
                </div>
                <div className="flight-info-item">
                  <span className="flight-info-label">Passagers</span>
                  <span className="flight-info-value">{passengers.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar-section">
            <div className="search-bar">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un passager par nom, numéro d'identité ou statut de paiement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="search-results">
              {searchTerm && (
                <span className="results-count">
                  {filteredPassengers.length} passager(s) trouvé(s)
                </span>
              )}
            </div>
          </div>

          {/* Passengers Table */}
          <div className="passengers-table-section">
            <table className="passengers-table">
              <thead>
                <tr>
                  <th>Nom du passager</th>
                  <th>Numéro d'identité</th>
                  <th>Paiement</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPassengers.length > 0 ? (
                  filteredPassengers.map(passenger => (
                    <tr key={passenger.id}>
                      <td className="passenger-name">{passenger.name}</td>
                      <td className="identity-number">{passenger.identityNumber}</td>
                      <td className={`payment-status ${passenger.payment === 'Payé' ? 'paid' : 'not-paid'}`}>
                        {passenger.payment}
                      </td>
                      <td className="reservation-status">
                        <span className={`status-badge ${passenger.status.toLowerCase().replace(' ', '-')}`}>
                          {passenger.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className="action-btn check-btn"
                          onClick={() => handleCheck(passenger.id)}
                          title="Confirmer le passager"
                        >
                          ✓
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(passenger.id)}
                          title="Supprimer le passager"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-results">
                      Aucun passager trouvé pour "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PassengerList;