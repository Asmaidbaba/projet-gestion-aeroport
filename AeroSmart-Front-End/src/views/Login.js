// pages/Login.js
import React, { useState } from 'react';
import '../styles/AeroSmart.css';

function Login({ onNavigate }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
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
      // IMPORTANT : URL relative → passera par setupProxy.js (http://localhost:9090)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Si le backend renvoie une erreur 4xx/5xx
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Erreur serveur (${res.status})`);
      }

      const user = await res.json(); // ex: {id, username, email}
      // Ici tu peux stocker l'utilisateur en state/contexte/localStorage si besoin
      alert(`Connexion réussie, bienvenue ${user.username || ''} !`);
      // onNavigate?.('home'); // ou la page que tu veux après login
    } catch (err) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aeroport-container">
      {/* Bandeau bleu */}
      <header className="header-section" role="banner">
        <h1 className="company-title">Aero Smart</h1>
        <p className="company-subtitle">
          Votre compagnie aérienne de confiance pour des voyages sécurisés. Rejoignez-nous et
          profitez de nos meilleures offres vers toutes les destinations marocaines.
        </p>
      </header>

      {/* Onglets */}
      <nav className="navigation-tabs" aria-label="Navigation authentification">
        <button
          type="button"
          className="tab active"
          aria-selected="true"
          onClick={() => onNavigate?.('login')}
        >
          Se Connecter
        </button>
        <button
          type="button"
          className="tab"
          aria-selected="false"
          onClick={() => onNavigate?.('register')}   // ✅ minuscule
        >
          S'inscrire
        </button>
      </nav>

      {/* Formulaire */}
      <section className="form-section">
        <h2 className="form-subtitle">Connexion</h2>

        <form onSubmit={handleSubmit} className="aeroport-form" autoComplete="on">
          <div className="input-section">
            <label htmlFor="username" className="input-label">Nom</label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              placeholder="Votre nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-section">
            <label htmlFor="password" className="input-label">Votre Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Erreur backend */}
          {error && (
            <div style={{ color: '#b00020', marginTop: 8 }}>{error}</div>
          )}

          <div className="forgot-password">
            <span
              className="forgot-link"
              onClick={() => alert('Redirection vers la page de réinitialisation…')}
            >
              Mot de passe oublié ?
            </span>
          </div>

          <div className="input-section">
             <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Connexion…' : 'Se Connecter'}
            </button>
          </div>
        </form>

        <div className="auth-redirect">
          <p>
            Pas de compte ?{' '}
            <span onClick={() => onNavigate?.('register')} className="auth-link">
              S'inscrire
            </span>
          </p>
        </div>
      </section>

      <div className="footer-section" />
    </div>
  );
}

export default Login;
