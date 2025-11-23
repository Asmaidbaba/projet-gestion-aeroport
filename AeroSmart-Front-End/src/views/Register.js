// pages/Register.js
import React, { useState } from 'react';
import '../styles/AeroSmart.css';

function Register({ onNavigate }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // IMPORTANT: URL relative → passera par src/setupProxy.js vers http://localhost:9090
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Erreur serveur (${res.status})`);
      }

      // Optionnel: lire la réponse (DTO utilisateur)
      // const user = await res.json();

      alert('Inscription réussie ! Vous pouvez vous connecter.');
      onNavigate?.('login'); // vers l'écran de connexion
    } catch (err) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aeroport-container">
      <div className="header-section">
        <h1 className="company-title">Aero Smart</h1>
        <p className="company-subtitle">
          Votre compagnie aérienne de confiance pour des voyages sécurisés.
          Rejoignez-nous et profitez de nos meilleures offres vers toutes les destinations marocaines.
        </p>
      </div>

      <div className="separator"></div>

      <div className="navigation-tabs">
        <span className="tab" onClick={() => onNavigate?.('login')}>Se Connecter</span>
        <span className="tab active">S'inscrire</span>
      </div>

      <div className="separator"></div>

      <div className="form-section">
        <h3 className="form-subtitle">Inscription</h3>

        <form onSubmit={handleSubmit} className="aeroport-form" autoComplete="on">
          <div className="input-section">
            <h4 className="input-label">Nom d'utilisateur</h4>
            <input
              type="text"
              name="username"
              placeholder="Choisissez un nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="input-section">
            <h4 className="input-label">Adresse email</h4>
            <input
              type="email"
              name="email"
              placeholder="Votre adresse email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="input-section">
            <h4 className="input-label">Mot de passe</h4>
            <input
              type="password"
              name="password"
              placeholder="Créez un mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              autoComplete="new-password"
            />
          </div>

          {error && <div style={{ color: '#b00020', marginTop: 8 }}>{error}</div>}

          <div className="input-section">
             <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Création du compte..." : "S'inscrire"}
            </button>
          </div>
        </form>

        <div className="auth-redirect">
          <p>
            déjà un compte ?{' '}
            <span onClick={() => onNavigate?.('login')} className="auth-link">
              Se connecter
            </span>
          </p>
        </div>
      </div>

      <div className="separator"></div>

      <div className="footer-section" />
    </div>
  );
}

export default Register;
