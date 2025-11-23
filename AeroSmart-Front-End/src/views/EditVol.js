import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/EditVol.css';
import AdminHeader from '../components/AdminHeader';

export default function EditVol() {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;

  const [flightId, setFlightId] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: '',
    departureAirport: '',
    arrivalAirport: '',
    departureTime: '',
    arrivalTime: '',
    capacity: '',
    availableSeats: '',
    price: '',
    flightStatus: 'SCHEDULED',
    boardingGate: '',
    gate: '',
    boardingTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Charger les données du vol à modifier
  useEffect(() => {
    if (!flight) {
      alert('❌ Aucun vol sélectionné. Retour à la liste.');
      navigate('/DisponibleVol');
      return;
    }

    console.log('🔍 Vol complet reçu:', flight);
    console.log('🔍 Type de flight.id:', typeof flight.id);
    console.log('🔍 Valeur de flight.id:', flight.id);

    // Extraire l'ID et le nettoyer
    let cleanId = flight.id;
    if (typeof cleanId === 'string') {
      // Si l'ID contient ':', prendre seulement la partie avant
      cleanId = cleanId.split(':')[0];
    }
    cleanId = parseInt(cleanId);
    
    console.log('✅ ID nettoyé:', cleanId);
    setFlightId(cleanId);

    // Formater les dates pour les inputs datetime-local
    const formatDateTimeLocal = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch (e) {
        console.error('Erreur de formatage de date:', e);
        return '';
      }
    };

    setFormData({
      flightNumber: flight.flightNumber || '',
      departureAirport: flight.departureAirport || '',
      arrivalAirport: flight.arrivalAirport || '',
      departureTime: formatDateTimeLocal(flight.departureTime),
      arrivalTime: formatDateTimeLocal(flight.arrivalTime),
      capacity: flight.capacity || '',
      availableSeats: flight.availableSeats || '',
      price: flight.price || '',
      flightStatus: flight.flightStatus || 'SCHEDULED',
      boardingGate: flight.boardingGate || '',
      gate: flight.gate || '',
      boardingTime: formatDateTimeLocal(flight.boardingTime)
    });
  }, [flight, navigate]);

  // ✅ Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!flightId) {
      setError('❌ ID du vol invalide');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Préparer les données à envoyer
      const dataToSend = {
        flightNumber: formData.flightNumber,
        departureAirport: formData.departureAirport,
        arrivalAirport: formData.arrivalAirport,
        departureTime: formData.departureTime ? new Date(formData.departureTime).toISOString() : null,
        arrivalTime: formData.arrivalTime ? new Date(formData.arrivalTime).toISOString() : null,
        capacity: parseInt(formData.capacity),
        availableSeats: parseInt(formData.availableSeats),
        price: parseFloat(formData.price),
        flightStatus: formData.flightStatus,
        boardingGate: formData.boardingGate || null,
        gate: formData.gate || null,
        boardingTime: formData.boardingTime ? new Date(formData.boardingTime).toISOString() : null
      };

      const apiUrl = `http://localhost:8080/api/flights/${flightId}`;
      console.log('📤 URL de l\'API:', apiUrl);
      console.log('📤 Données envoyées:', dataToSend);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('📥 Réponse status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur serveur:', errorText);
        throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur lors de la modification du vol'}`);
      }

      const updatedFlight = await response.json();
      console.log('✅ Vol mis à jour:', updatedFlight);

      alert('✅ Vol modifié avec succès !');
      navigate('/DisponibleVol');
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      setError(`❌ ${err.message || 'Erreur lors de la modification. Veuillez réessayer.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!flight) {
    return null;
  }

  return (
    <div className="edit-vol-container">
      {/* Admin Header */}
      <AdminHeader />

      {/* Contenu principal */}
      <div className="edit-vol-content">
        {/* Header avec bouton retour */}
        <div className="edit-vol-header">
          <button
            onClick={() => navigate('/DisponibleVol')}
            className="back-button"
          >
            ← Retour
          </button>
          <h1 className="edit-vol-title">
            Modifier le vol {flight.flightNumber}
          </h1>
          <div className="header-spacer"></div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-vol-form">
          {/* Informations de base */}
          <div className="form-section">
            <h2 className="section-title">Informations de base</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="flightNumber">Numéro de vol *</label>
                <input
                  type="text"
                  id="flightNumber"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  required
                  placeholder="Ex: AF345"
                />
              </div>

              <div className="form-group">
                <label htmlFor="flightStatus">Statut du vol *</label>
                <select
                  id="flightStatus"
                  name="flightStatus"
                  value={formData.flightStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="SCHEDULED">Prévu</option>
                  <option value="DELAYED">Retardé</option>
                  <option value="CANCELLED">Annulé</option>
                  <option value="COMPLETED">Terminé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Itinéraire */}
          <div className="form-section">
            <h2 className="section-title">Itinéraire</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="departureAirport">Aéroport de départ *</label>
                <input
                  type="text"
                  id="departureAirport"
                  name="departureAirport"
                  value={formData.departureAirport}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Mohammed V de Casablanca"
                />
              </div>

              <div className="form-group">
                <label htmlFor="arrivalAirport">Aéroport d'arrivée *</label>
                <input
                  type="text"
                  id="arrivalAirport"
                  name="arrivalAirport"
                  value={formData.arrivalAirport}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Al Massira d'Agadir"
                />
              </div>

              <div className="form-group">
                <label htmlFor="departureTime">Date et heure de départ *</label>
                <input
                  type="datetime-local"
                  id="departureTime"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="arrivalTime">Date et heure d'arrivée *</label>
                <input
                  type="datetime-local"
                  id="arrivalTime"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Capacité et tarifs */}
          <div className="form-section">
            <h2 className="section-title">Capacité et tarifs</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="capacity">Capacité totale *</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Ex: 150"
                />
              </div>

              <div className="form-group">
                <label htmlFor="availableSeats">Places disponibles *</label>
                <input
                  type="number"
                  id="availableSeats"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Ex: 123"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Prix (MAD) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Ex: 1500"
                />
              </div>
            </div>
          </div>

          {/* Informations d'embarquement */}
          <div className="form-section">
            <h2 className="section-title">Informations d'embarquement (optionnel)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="boardingGate">Poste d'embarquement</label>
                <input
                  type="text"
                  id="boardingGate"
                  name="boardingGate"
                  value={formData.boardingGate}
                  onChange={handleChange}
                  placeholder="Ex: B31"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gate">Porte d'embarquement</label>
                <input
                  type="text"
                  id="gate"
                  name="gate"
                  value={formData.gate}
                  onChange={handleChange}
                  placeholder="Ex: A114"
                />
              </div>

              <div className="form-group">
                <label htmlFor="boardingTime">Heure d'embarquement</label>
                <input
                  type="datetime-local"
                  id="boardingTime"
                  name="boardingTime"
                  value={formData.boardingTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="form-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/DisponibleVol')}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Modification en cours...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}