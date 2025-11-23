import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ConfirmationReservations.css';
import AdminHeader from '../components/AdminHeader.js';

const ConfirmationReservations = () => {
  const [flights, setFlights] = useState([
    {
      id: 1,
      flightNumber: "V12B",
      date: "19/10/2025",
      time: "12:45",
      pendingReservations: 3
    },
    {
      id: 2,
      flightNumber: "V12B",
      date: "19/10/2025",
      time: "12:45",
      pendingReservations: 10
    },
    {
      id: 3,
      flightNumber: "V12C",
      date: "19/10/2025",
      time: "12:45",
      pendingReservations: 9
    },
    {
      id: 4,
      flightNumber: "V12B",
      date: "19/10/2025",
      time: "12:45",
      pendingReservations: 7
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleViewReservations = (flightId) => {
    console.log('Voir réservations pour le vol:', flightId);
    // Navigation vers la page PassengerList
    navigate('/passengers', { 
      state: { 
        flightId: flightId,
        flight: flights.find(f => f.id === flightId)
      }
    });
  };

  const handleAddFlight = () => {
    console.log('Ajouter un nouveau vol');
    // Navigation vers la page d'ajout de vol
    navigate('/add-flight');
  };

  // Filtrer les vols basé sur la recherche
  const filteredFlights = flights.filter(flight =>
    flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.date.includes(searchTerm) ||
    flight.time.includes(searchTerm)
  );

  return (
    <div className="confirmation-reservations">
      {/* Admin Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className="confirmation-main">
        <div className="confirmation-container">
          
          {/* Page Title */}
          <div className="page-title-section">
            <h2>Confirmation des réservations</h2>
          </div>

          {/* Search Bar */}
          <div className="search-bar-section">
            <div className="search-bar">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un vol par numéro, date ou heure..."
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
                  {filteredFlights.length} vol(s) trouvé(s)
                </span>
              )}
            </div>
          </div>

          {/* Flights Table */}
          <div className="flights-table-section">
            <table className="flights-table">
              <thead>
                <tr>
                  <th>Numéro vol</th>
                  <th>Date Départ</th>
                  <th>Heure départ</th>
                  <th>Réservation en attente</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.length > 0 ? (
                  filteredFlights.map(flight => (
                    <tr key={flight.id}>
                      <td className="flight-number">{flight.flightNumber}</td>
                      <td className="flight-date">{flight.date}</td>
                      <td className="flight-time">{flight.time}</td>
                      <td className="pending-reservations">
                        <span className="reservation-count">
                          {flight.pendingReservations}
                        </span>
                      </td>
                      <td className="actions">
                        <button 
                          className="view-reservations-btn"
                          onClick={() => handleViewReservations(flight.id)}
                        >
                          Voir réservations
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-results">
                      Aucun vol trouvé pour "{searchTerm}"
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

export default ConfirmationReservations;