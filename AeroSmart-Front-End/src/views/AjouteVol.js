import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AjouteVol.css';
import AdminHeader from '../components/AdminHeader';

// ⚠️ IMPORTANT: Changez le port si votre backend utilise 8080 au lieu de 8081
const API_URL = 'http://localhost:8081/api/flights';

// Icônes SVG personnalisées
const PlaneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003d82" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const LuggageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003d82" strokeWidth="2">
    <path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0"/>
    <path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"/>
    <path d="M10 20h4"/>
    <circle cx="16" cy="20" r="2"/>
    <circle cx="8" cy="20" r="2"/>
  </svg>
);

export default function AeroSmartForm() {
  const [formData, setFormData] = useState({
    flightNumber: '',
    capacity: '',
    departureAirport: '',
    arrivalAirport: '',
    departureDate: '2025-10-19',
    arrivalDate: '2025-10-19',
    departureTime: '',
    arrivalTime: '',
    boardingGate: '',
    flightStatus: '',
    boardingStart: '',
    boardingEnd: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convertir automatiquement flightNumber en majuscules
    const newValue = name === 'flightNumber' ? value.toUpperCase() : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    setError(null);
    setSuccess(false);
  };

  // Fonction pour mapper le statut frontend vers le statut backend
  const mapFlightStatus = (status) => {
    const statusMap = {
      'on-time': 'SCHEDULED',
      'delayed': 'DELAYED',
      'cancelled': 'CANCELLED',
      'boarding': 'BOARDING'
    };
    return statusMap[status] || 'SCHEDULED';
  };

  // ✅ NOUVELLE FONCTION handleSubmit avec appel API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Combiner date et heure pour créer des timestamps ISO
      // S'assurer que l'heure est au format HH:MM avant d'ajouter :00
      const formatTime = (time) => {
        if (!time) return '';
        const parts = time.split(':');
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      };

      const departureDateTime = `${formData.departureDate}T${formatTime(formData.departureTime)}:00`;
      const arrivalDateTime = `${formData.arrivalDate}T${formatTime(formData.arrivalTime)}:00`;
      const boardingStartDateTime = formData.boardingStart 
        ? `${formData.departureDate}T${formatTime(formData.boardingStart)}:00` 
        : null;
      const boardingEndDateTime = formData.boardingEnd 
        ? `${formData.departureDate}T${formatTime(formData.boardingEnd)}:00` 
        : null;

      // ✅ Créer l'objet Flight avec les noms de champs correspondant EXACTEMENT au backend
      const flightData = {
        flightNumber: formData.flightNumber.toUpperCase(),
        departureAirport: formData.departureAirport,      
        arrivalAirport: formData.arrivalAirport,          
        departureTime: departureDateTime,
        arrivalTime: arrivalDateTime,
        capacity: parseInt(formData.capacity),           
        availableSeats: parseInt(formData.capacity),
        flightStatus: mapFlightStatus(formData.flightStatus), 
        price: 1500.0,
        boardingGate: formData.boardingGate || null,      
        boardingStart: boardingStartDateTime,             
        boardingEnd: boardingEndDateTime                 
      };

      console.log('🚀 Envoi des données vers:', API_URL);
      console.log('📦 Données envoyées:', flightData);

      // Appel à l'API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData)
      });

      console.log('📡 Réponse HTTP:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Vol créé avec succès:', result);

      setSuccess(true);
      alert('✅ Vol ajouté avec succès!');

      // Réinitialiser le formulaire
      setFormData({
        flightNumber: '',
        capacity: '',
        departureAirport: '',
        arrivalAirport: '',
        departureDate: '2025-10-19',
        arrivalDate: '2025-10-19',
        departureTime: '',
        arrivalTime: '',
        boardingGate: '',
        flightStatus: '',
        boardingStart: '',
        boardingEnd: ''
      });

    } catch (err) {
      console.error('❌ Erreur lors de l\'ajout du vol:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'ajout du vol');
      alert(`❌ Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToConfirmation = () => {
    navigate('/disponibleVols');
  };

  return (
    <div className="container">
      {/* Admin Header */}
      <AdminHeader />

      <main className="main">
        {/* Header avec bouton retour */}
        <div className="page-header">
          <button 
            className="back-button"
            onClick={handleBackToConfirmation}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux vols
          </button>
          <h1 className="title">
            Remplissez le formulaire pour créer un nouveau vol
          </h1>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            color: '#c00'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: '8px',
            color: '#0a0'
          }}>
            ✅ Vol ajouté avec succès!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <section className="section">
            <div className="section-header">
              <InfoIcon />
              <h2 className="section-title">Information de base de vol</h2>
            </div>

            <div className="grid">
              <div className="form-group">
                <label className="label">Numéro de vol * (ex: AF345)</label>
                <input
                  type="text"
                  name="flightNumber"
                  placeholder="EX: AF345 (2 lettres + 3-4 chiffres)"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  className="input"
                  required
                  pattern="^[A-Z]{2}\d{3,4}$"
                  title="Format: 2 lettres MAJUSCULES + 3 ou 4 chiffres (ex: AF345)"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div className="form-group">
                <label className="label">Capacité (passagers) *</label>
                <input
                  type="number"
                  name="capacity"
                  placeholder="EX: 250"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="input"
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label className="label">Aéroport de départ *</label>
                <select
                  name="departureAirport"
                  value={formData.departureAirport}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Rabat">Rabat</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Aéroport d'arrivée *</label>
                <select
                  name="arrivalAirport"
                  value={formData.arrivalAirport}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Agadir">Agadir</option>
                  <option value="Tanger">Tanger</option>
                  <option value="Marrakech">Marrakech</option>
                  <option value="Rabat">Rabat</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Date de départ *</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Date d'arrivée *</label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Heure de départ *</label>
                <input
                  type="time"
                  name="departureTime"
                  placeholder="EX: 8:00"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Heure d'arrivée *</label>
                <input
                  type="time"
                  name="arrivalTime"
                  placeholder="EX: 8:00"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <LuggageIcon />
              <h2 className="section-title">Informations d'embarquement</h2>
            </div>

            <div className="grid">
              <div className="form-group">
                <label className="label">Porte d'embarquement</label>
                <input
                  type="text"
                  name="boardingGate"
                  placeholder="EX: A15"
                  value={formData.boardingGate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Statut du vol *</label>
                <select
                  name="flightStatus"
                  value={formData.flightStatus}
                  onChange={handleChange}
                  className="select"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="on-time">À l'heure (SCHEDULED)</option>
                  <option value="delayed">Retardé (DELAYED)</option>
                  <option value="cancelled">Annulé (CANCELLED)</option>
                  <option value="boarding">Embarquement (BOARDING)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">Début d'embarquement</label>
                <input
                  type="time"
                  name="boardingStart"
                  placeholder="EX: 7:30"
                  value={formData.boardingStart}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="label">Fin d'embarquement</label>
                <input
                  type="time"
                  name="boardingEnd"
                  placeholder="EX: 7:50"
                  value={formData.boardingEnd}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </section>

          <div className="button-container">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⏳ Ajout en cours...' : '✈️ Ajouter le vol'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}