import React, { useState } from 'react';
import '../styles/Home.css';
import HomeHeader from '../components/HomeHeader';
import HomeFooter from '../components/HomeFooter';
import { searchFlights } from '../services/flightService';

function App() {
  const [searchParams, setSearchParams] = useState({
    from: 'Casablanca',
    to: 'Agadir',
    departureDate: '',
    passengers: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('📤 Form data:', searchParams);

    if (!searchParams.from || !searchParams.to || !searchParams.departureDate) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      const result = await searchFlights({
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.departureDate,
        passengers: searchParams.passengers
      });
      
      console.log('🔍 API Response:', result);
      
      if (result.success) {
        if (result.flights && result.flights.length > 0) {
          console.log('✈️ Flights data:', result.flights);
          
          localStorage.setItem('flightResults', JSON.stringify({
            flights: result.flights,
            searchParams: searchParams
          }));
          window.location.href = '/results';
        } else {
          setError('Aucun vol trouvé pour votre recherche');
        }
      } else {
        setError(result.error || 'Erreur lors de la recherche');
      }
    } catch (err) {
      console.error('❌ Search error:', err);
      setError('Impossible de se connecter au serveur. Vérifiez que le serveur Flask est démarré.');
    } finally {
      setLoading(false);
    }
  };

  const setDestination = (destination) => {
    setSearchParams(prev => ({
      ...prev,
      to: destination
    }));
  };

  return (
    <div className="App">
      <HomeHeader />

      {/* Hero Section */}
      <section className="hero">
        <h1>L'aéroport intelligent, dans votre poche</h1>
        <p>Découvrez des vols exceptionnels vers les plus belles destinations du Maroc</p>
      </section>

      {/* Flight Search Section */}
      <section className="flight-search">
        <h2 className="section-title">Où Voulez-vous aller ?</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>Depuis *</label>
              <input
                type="text"
                name="from"
                value={searchParams.from}
                onChange={handleInputChange}
                placeholder="Ex: Casablanca"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Jusqu'à *</label>
              <input
                type="text"
                name="to"
                value={searchParams.to}
                onChange={handleInputChange}
                placeholder="Ex: Tanger"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date de départ *</label>
              <input
                type="date"
                name="departureDate"
                value={searchParams.departureDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Passagers</label>
              <select
                name="passengers"
                value={searchParams.passengers}
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Adulte' : 'Adultes'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destinations rapides */}
          <div className="quick-destinations">
            <label>Destinations populaires:</label>
            <div className="destination-buttons">
              {['Tanger', 'Marrakech', 'Agadir', 'Fès', 'Rabat'].map(city => (
                <button
                  key={city}
                  type="button"
                  className={`quick-dest-btn ${searchParams.to === city ? 'active' : ''}`}
                  onClick={() => setDestination(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="search-button">
            {loading ? 'Recherche en cours...' : 'Rechercher des vols'}
          </button>
        </form>
      </section>

      {/* Best Offers Section */}
      <section className="best-offers">
        <h2 className="section-title">Meilleurs offres en ce moment</h2>
        <div className="offers-grid">
          <div className="offer-card" onClick={() => setDestination('Tanger')}>
            <img src="/images/Taghazout.jpg" alt="Tanger" className="offer-image" />
            <div className="offer-content">
              <h3 className="offer-title">Tanger</h3>
              <p className="offer-location">Tanger-Tétouan, Maroc</p>
              <p className="offer-price">À partir de 1500 MAD</p>
            </div>
          </div>

          <div className="offer-card" onClick={() => setDestination('Marrakech')}>
            <img src="/images/Essaouira.jpg" alt="Marrakech" className="offer-image" />
            <div className="offer-content">
              <h3 className="offer-title">Marrakech</h3>
              <p className="offer-location">Marrakech-Safi, Maroc</p>
              <p className="offer-price">À partir de 1200 MAD</p>
            </div>
          </div>

          <div className="offer-card" onClick={() => setDestination('Agadir')}>
            <img src="/images/Agadir.jpg" alt="Agadir" className="offer-image" />
            <div className="offer-content">
              <h3 className="offer-title">Agadir</h3>
              <p className="offer-location">Sous-Massa, Maroc</p>
              <p className="offer-price">À partir de 1000 MAD</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about">
        <div className="about-content">
          <h2>A propos</h2>
          <p>Votre compagnie aérienne de confiance pour des voyages sécurisés</p>
          <div className="contact-info">
            <h3>Contacter-nous</h3>
            <ul className="contact-details">
              <li>📞 +212 6748392614</li>
              <li>✉️ Aerosmart@gmail.com</li>
              <li>📍 Aéroport Mohammed V, Casablanca</li>
            </ul>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}

export default App;