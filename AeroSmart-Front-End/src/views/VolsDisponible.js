import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VolsDisponible.css';
import Header from '../components/Header';
import AdminHeader from '../components/AdminHeader';

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

export default function VolsDisponibles() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Données mockées pour le frontend
  const flights = [
    {
      id: 1,
      flightNumber: "AF123",
      departureAirport: "Casablanca",
      arrivalAirport: "Paris",
      departureTime: "2024-01-15T08:00:00",
      arrivalTime: "2024-01-15T12:30:00",
      price: 2500,
      capacity: 180,
      availableSeats: 45,
      flightStatus: "SCHEDULED"
    },
    {
      id: 2,
      flightNumber: "RAM456",
      departureAirport: "Casablanca",
      arrivalAirport: "Agadir",
      departureTime: "2024-01-15T14:20:00",
      arrivalTime: "2024-01-15T15:45:00",
      price: 800,
      capacity: 150,
      availableSeats: 23,
      flightStatus: "SCHEDULED"
    },
    {
      id: 3,
      flightNumber: "AT789",
      departureAirport: "Marrakech",
      arrivalAirport: "Tanger",
      departureTime: "2024-01-16T10:15:00",
      arrivalTime: "2024-01-16T11:30:00",
      price: 600,
      capacity: 120,
      availableSeats: 89,
      flightStatus: "SCHEDULED"
    },
    {
      id: 4,
      flightNumber: "QR321",
      departureAirport: "Rabat",
      arrivalAirport: "Dubai",
      departureTime: "2024-01-16T22:45:00",
      arrivalTime: "2024-01-17T06:30:00",
      price: 4200,
      capacity: 220,
      availableSeats: 12,
      flightStatus: "SCHEDULED"
    }
  ];

  // ✅ FONCTION DE NAVIGATION POUR LE BOUTON CONSULTER
  const handleConsultClick = (flight) => {
    navigate('/flightDetails', { state: { flight } });
  };

  // Fonction pour formater l'heure
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filtrer les vols selon la recherche
  const filteredFlights = flights.filter(flight =>
    flight.departureAirport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.arrivalAirport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    flight.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Header Admin */}
      <AdminHeader />

      {/* Contenu principal */}
      <main className="admin-main">
        <h1 className="admin-title">Bienvenue dans votre espace d'administration</h1>

        <div className="admin-search-container">
          <div className="admin-search-wrapper">
            <div className="admin-search-icon">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Recherche"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <a href="/addvol" className="admin-add-button">
            Ajouter vol
          </a>
        </div>

        {/* LISTE DES VOLS */}
        <div className="admin-flights-list">
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <div key={flight.id} className="admin-flight-card">
                <div className="admin-flight-info">
                  <div className="admin-flight-route">
                    {flight.departureAirport} → {flight.arrivalAirport}
                  </div>
                  <div className="admin-flight-details">
                    Départ: {formatTime(flight.departureTime)} | 
                    Arrivée: {formatTime(flight.arrivalTime)} | 
                    Vol: {flight.flightNumber}
                  </div>
                  <div className="admin-flight-date">{formatDate(flight.departureTime)}</div>
                  <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                    Places: {flight.availableSeats}/{flight.capacity} | 
                    Prix: {flight.price} MAD | 
                    Statut: {flight.flightStatus}
                  </div>
                </div>
                <button 
                  className="admin-consult-button" 
                  onClick={() => handleConsultClick(flight)}
                >
                  Consulter
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p style={{ fontSize: '18px' }}>
                {searchTerm ? 'Aucun vol trouvé pour cette recherche' : 'Aucun vol disponible'}
              </p>
            </div>
          )}
        </div>

        {/* STATISTIQUES */}
        {flights.length > 0 && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f0f8ff',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <strong>Total des vols: {flights.length}</strong> | 
            <strong> Affichés: {filteredFlights.length}</strong> | 
            <strong> Places disponibles: {flights.reduce((sum, f) => sum + f.availableSeats, 0)}</strong>
          </div>
        )}
      </main>
    </div>
  );
}