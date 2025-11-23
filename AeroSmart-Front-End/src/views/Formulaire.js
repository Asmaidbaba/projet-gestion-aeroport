import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Formulaire.css';
import Header from '../components/Header';

// Composants d'icônes SVG professionnels
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PlaneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line>
    <line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export default function Formulaire() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    civilite: '',
    numeroSiege: '',
    codePays: '+212 (Maroc)',
    telephone: '',
    email: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReserver = () => {
    console.log('Réservation:', formData);
    alert('Réservation effectuée avec succès !');
    // Navigation vers la page de confirmation ou de paiement
    navigate('/confirmation');
  };

  const handleAnnuler = () => {
    setFormData({
      nom: '',
      prenom: '',
      civilite: '',
      numeroSiege: '',
      codePays: '+212 (Maroc)',
      telephone: '',
      email: ''
    });
  };

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  return (
    <div className="formulaire-page">
      {/* Header avec stepper */}
      <Header currentStep={3} />

      {/* Contenu principal */}
      <div className="formulaire-content">
        {/* Titre avec bouton retour */}
        <div className="formulaire-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeftIcon />
            Retour
          </button>
          <h2 className="formulaire-title">Compléter la réservation</h2>
          <div className="route-info">
            <span className="departure">Casablanca</span>
            <span className="separator">→</span>
            <span className="arrival">Agadir</span>
          </div>
        </div>

        {/* Formulaire */}
        <div className="form-container">
          {/* Informations personnelles */}
          <div className="section">
            <div className="section-header">
              <span className="icon"><UsersIcon /></span>
              <h2>Informations personnelles</h2>
            </div>

            <div className="form-fields">
              <div className="form-field">
                <span className="field-icon"><UserIcon /></span>
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Votre nom"
                />
              </div>

              <div className="form-field">
                <span className="field-icon"><UserIcon /></span>
                <label>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                />
              </div>

              <div className="form-field">
                <span className="field-icon"><UserIcon /></span>
                <label>Civilité</label>
                <select
                  name="civilite"
                  value={formData.civilite}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez</option>
                  <option value="M">M.</option>
                  <option value="Mme">Mme</option>
                  <option value="Mlle">Mlle</option>
                </select>
              </div>

              <div className="form-field">
                <span className="field-icon"><PlaneIcon /></span>
                <label>Numéro de siège</label>
                <select
                  name="numeroSiege"
                  value={formData.numeroSiege}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner</option>
                  <option value="1A">1A</option>
                  <option value="1B">1B</option>
                  <option value="1C">1C</option>
                  <option value="2A">2A</option>
                  <option value="2B">2B</option>
                  <option value="2C">2C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="section">
            <div className="section-header">
              <span className="icon"><MapIcon /></span>
              <h2>Coordonnées</h2>
            </div>

            <div className="form-fields">
              <div className="form-field">
                <span className="field-icon invisible"><MapPinIcon /></span>
                <label>Code pays</label>
                <select
                  name="codePays"
                  value={formData.codePays}
                  onChange={handleChange}
                >
                  <option value="+212 (Maroc)">+212 (Maroc)</option>
                  <option value="+33 (France)">+33 (France)</option>
                  <option value="+34 (Espagne)">+34 (Espagne)</option>
                  <option value="+1 (USA)">+1 (USA)</option>
                </select>
              </div>

              <div className="form-field">
                <span className="field-icon"><PhoneIcon /></span>
                <label>Numéro de téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <div className="form-field">
                <span className="field-icon"><MailIcon /></span>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Votre email"
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="button-group">
            <button className="btn btn-primary" onClick={handleReserver}>
              Réserver
            </button>
            <button className="btn btn-secondary" onClick={handleAnnuler}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}