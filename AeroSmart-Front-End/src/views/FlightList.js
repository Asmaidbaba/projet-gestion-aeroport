import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FlightList.css';
import Header from '../components/Header';

const FlightList = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInfo, setSearchInfo] = useState({});
  const navigate = useNavigate();

  // Get flights from localStorage
  useEffect(() => {
    const storedResults = localStorage.getItem('flightResults');
    
    if (storedResults) {
      try {
        const { flights, searchParams } = JSON.parse(storedResults);
        console.log('📥 Loaded flights from localStorage:', flights);
        console.log('📥 Search params:', searchParams);
        
        setFlights(flights);
        setSearchInfo(searchParams || {});
        setLoading(false);
      } catch (error) {
        console.error('❌ Error parsing stored results:', error);
        navigate('/home');
      }
    } else {
      // If no flights in localStorage, redirect to home
      console.log('❌ No flight results found in localStorage');
      navigate('/home');
    }
  }, [navigate]);

  // Function to get weather icon
  const getWeatherIcon = (weather) => {
    if (weather.toLowerCase().includes('ensoleillé')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="weather-icon sun-icon">
          <circle cx="12" cy="12" r="5" strokeWidth="2"/>
          <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2M4 12H2m20 0h-2m-2.5-5.5l-1.5 1.5m-7-7L7.5 7.5m9 9l1.5 1.5m-11 0l1.5-1.5"/>
        </svg>
      );
    } else if (weather.toLowerCase().includes('nuageux')) {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="weather-icon cloud-icon">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z"/>
        </svg>
      );
    } else {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="weather-icon default-icon">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m-8-9H3m16 0h-1M6.343 6.343l-.707.707m12.728 12.728l-.707.707M6.343 17.657l-.707-.707m12.728-12.728l-.707-.707"/>
        </svg>
      );
    }
  };

  // Format backend flight data to frontend format
  const formatFlightData = (backendFlight) => {
    console.log('🔄 Formatting flight data:', backendFlight);
    
    const departureTime = new Date(backendFlight.departure_time);
    const arrivalTime = new Date(backendFlight.arrival_time);
    
    // Calculate duration
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    // Simple weather based on time of day
    const hour = departureTime.getHours();
    const weather = hour >= 6 && hour <= 18 ? 'Ensoleillé' : 'Nuit claire';
    const temperature = hour >= 6 && hour <= 18 ? '26°C' : '18°C';

    return {
      id: backendFlight.id,
      departure: {
        time: departureTime.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        city: backendFlight.departure_city || backendFlight.departure_airport,
        airport: backendFlight.departure_airport
      },
      arrival: {
        time: arrivalTime.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        city: backendFlight.arrival_city || backendFlight.arrival_airport,
        airport: backendFlight.arrival_airport
      },
      duration: `${hours}h ${minutes}min`,
      type: "Vol direct",
      temperature: temperature,
      weather: weather,
      priceOptions: [
        { 
          seats: backendFlight.available_seats, 
          price: `MAD ${backendFlight.price?.toFixed(2) || '0.00'}` 
        }
      ],
      // Keep backend data for booking
      backendData: backendFlight
    };
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    console.log('✈️ Vol sélectionné:', flight);
    
    // Stocker les données formatées pour le service externe
    const flightDataForService = {
      id: flight.backendData.id,
      from: flight.departure.city,
      to: flight.arrival.city,
      departureTime: flight.departure.time,
      arrivalTime: flight.arrival.time,
      price: flight.backendData.price,
      flight_number: flight.backendData.flight_number,
      airline: flight.backendData.airline,
      departure_airport: flight.departure.airport,
      arrival_airport: flight.arrival.airport,
      // Données pour le service de bagages
      baggage: {
        included: {
          cabin: "1x 10kg",
          hand: "1x sac"
        },
        options: [
          { code: "EXTRA_1", label: "1er bagage 23kg", price: 640 },
          { code: "EXTRA_2", label: "2e bagage 23kg", price: 1500 },
          { code: "OVERWEIGHT", label: "Bagage en surpoids", price: 1850 }
        ]
      }
    };
    
    // Stocker pour la page bagage
    localStorage.setItem('selectedFlight', JSON.stringify(flightDataForService));
    
    // Naviguer vers la page bagage
    window.location.href = '/bagage';
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '--/--/----';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flight-list-page">
        <Header currentStep={1} />
        <div className="loading">Chargement des vols...</div>
      </div>
    );
  }

  return (
    <div className="flight-list-page">
      {/* Header avec navigation et étapes */}
      <Header currentStep={1} />

      {/* Carte d'informations de recherche */}
      <div className="search-info-card">
        <div className="search-info-header">
          <button 
            className="back-button"
            onClick={handleBackToHome}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="route-info">
            <div className="route-main">
              <span className="cities">{searchInfo.from} → {searchInfo.to}</span>
              <span className="separator">|</span>
              <span className="travel-date">{formatDisplayDate(searchInfo.departureDate)}</span>
              <span className="separator">|</span>
              <span className="passengers">{searchInfo.passengers} Adulte{searchInfo.passengers > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flight-list-container">
        <div className="results-header">
          <h2 className="results-title">
            {flights.length} vol{flights.length > 1 ? 's' : ''} trouvé{flights.length > 1 ? 's' : ''}
          </h2>
        </div>

        <div className="flights-container">
          {flights.length === 0 ? (
            <div className="no-flights">
              <h3>Aucun vol trouvé</h3>
              <p>Aucun vol disponible pour ces critères de recherche.</p>
              <button onClick={handleBackToHome} className="back-home-btn">
                Retour à l'accueil
              </button>
            </div>
          ) : (
            flights.map(backendFlight => {
              const flight = formatFlightData(backendFlight);
              console.log('🎫 Displaying flight:', flight);
              
              return (
                <div key={flight.id} className="flight-card">
                  <div className="flight-main-info">
                    
                    {/* Colonne Départ */}
                    <div className="flight-column departure-column">
                      <div className="time-section">
                        <div className="time">{flight.departure.time}</div>
                        <div className="city">{flight.departure.city}</div>
                      </div>
                      <div className="weather-section">
                        <div className="weather-display">
                          {getWeatherIcon(flight.weather)}
                          <span className="temperature">{flight.temperature}</span>
                        </div>
                        <div className="weather-condition">{flight.weather}</div>
                      </div>
                    </div>

                    {/* Colonne Vol */}
                    <div className="flight-column flight-route-column">
                      <div className="duration">{flight.duration}</div>
                      <div className="flight-type">{flight.type}</div>
                      <div className="flight-route">
                        <div className="route-line">
                          <div className="departure-dot"></div>
                          <div className="flight-path">
                            <div className="dashed-line"></div>
                          </div>
                          <div className="arrival-dot"></div>
                        </div>
                      </div>
                    </div>

                    {/* Colonne Arrivée */}
                    <div className="flight-column arrival-column">
                      <div className="time-section">
                        <div className="time">{flight.arrival.time}</div>
                        <div className="city">{flight.arrival.city}</div>
                      </div>
                      <div className="weather-section">
                        <div className="weather-display">
                          {getWeatherIcon(flight.weather)}
                          <span className="temperature">{flight.temperature}</span>
                        </div>
                        <div className="weather-condition">{flight.weather}</div>
                      </div>
                    </div>

                    {/* Colonne Prix et Détails */}
                    <div className="flight-column details-column">
                      <div className="price-section">
                        <div className="price-option">
                          <div className="seats-available">{flight.priceOptions[0].seats} sièges disponibles</div>
                          <div className="price">{flight.priceOptions[0].price}</div>
                        </div>
                      </div>
                      <div className="actions-section">
                        <button 
                          className="select-btn"
                          onClick={() => handleSelectFlight(flight)}
                        >
                          Sélectionner
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightList;