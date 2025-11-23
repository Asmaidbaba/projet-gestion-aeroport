import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FlightDetails.css";
import AdminHeader from "../components/AdminHeader";

export default function FlightDetails() {
  const navigate = useNavigate();

  // Fonction pour naviguer vers EditVol.js
  const handleModifierClick = () => {
    navigate('/editvol');
  };

  // Fonction pour supprimer le vol
  const handleSupprimerClick = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vol ?')) {
      console.log('Vol supprimé');
      // Ici vous pouvez ajouter la logique pour supprimer le vol
      // Après suppression, vous pouvez naviguer vers une autre page
      navigate('/vols-disponibles');
    }
  };

  return (
    <div className="flight-details-fullpage">
      <AdminHeader />
      
      {/* 🕑 En-tête horaires */}
      <div className="flight-header-fullpage">
        <div className="flight-time-main">
          <div className="flight-time-large">12:45</div>
          <div className="flight-info">
            <div className="flight-duration-large">1 heure 25 minutes</div>
            <div className="flight-type-large">Vol direct</div>
          </div>
          <div className="flight-time-large">14:30</div>
        </div>
      </div>

      {/* 🧳 Contenu principal */}
      <div className="main-content-fullpage">

        {/* Détails du vol */}
        <div className="content-card">
          <h2 className="section-title-large">Détails du vol</h2>
          <div className="detail-grid-fullpage">
            <div className="detail-label-large">Numéro de vol:</div>
            <div className="detail-value-large">AF345</div>
            <div className="detail-label-large">Capacité (passagers):</div>
            <div className="detail-value-large">150</div>
          </div>
        </div>

        {/* Itinéraire */}
        <div className="content-card">
          <h2 className="section-title-large">Itinéraire</h2>
          <div className="detail-grid-fullpage">
            <div className="detail-label-large">Aéroport de départ:</div>
            <div className="detail-value-large">Mohammed V de Casablanca</div>
            <div className="detail-label-large">Aéroport d'arrivée:</div>
            <div className="detail-value-large">Al Massira d'Agadir</div>
            <div className="detail-label-large">Date de départ:</div>
            <div className="detail-value-large">19/10/2025</div>
            <div className="detail-label-large">Date d'arrivée:</div>
            <div className="detail-value-large">19/10/2025</div>
            <div className="detail-label-large">Heure de départ:</div>
            <div className="detail-value-large">12:45</div>
            <div className="detail-label-large">Heure d'arrivée:</div>
            <div className="detail-value-large">14:30</div>
          </div>
        </div>

        {/* Informations d'embarquement */}
        <div className="content-card">
          <h2 className="section-title-large">Informations d'embarquement</h2>
          <table className="info-table-fullpage">
            <tbody>
              <tr>
                <td className="info-label-large">Poste d'embarquement:</td>
                <td className="info-data-large">B31</td>
              </tr>
              <tr>
                <td className="info-label-large">Statut du vol:</td>
                <td className="info-data-large status-delayed-large">Retardé</td>
              </tr>
              <tr>
                <td className="info-label-large">Porte d'embarquement:</td>
                <td className="info-data-large">Porte A114</td>
              </tr>
              <tr>
                <td className="info-label-large">Fin d'embarquement:</td>
                <td className="info-data-large">14h45</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔘 Boutons */}
      <div className="buttons-container-fullpage">
        <button 
          className="btn-large btn-modify-large"
          onClick={handleModifierClick}
        >
          Modifier
        </button>
        <button 
          className="btn-large btn-delete-large"
          onClick={handleSupprimerClick}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}