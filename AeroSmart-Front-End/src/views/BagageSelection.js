import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BagageSelection.css';
import Header from '../components/Header';

export default function BaggageSelection() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [flightInfo, setFlightInfo] = useState(null);
  const [baggageOptions, setBaggageOptions] = useState([]);
  const navigate = useNavigate();

  // Charger les informations du vol depuis localStorage
  useEffect(() => {
    const storedFlight = localStorage.getItem('selectedFlight');
    if (storedFlight) {
      try {
        const flightData = JSON.parse(storedFlight);
        setFlightInfo(flightData);
        
        // Convertir les options de bagages du service externe vers votre format
        const convertedPlans = convertBaggageOptions(flightData.baggage);
        setBaggageOptions(convertedPlans);
        
      } catch (error) {
        console.error('Error parsing flight data:', error);
      }
    }
  }, []);

  // Fonction pour convertir les options de bagages du format externe vers votre format
  const convertBaggageOptions = (baggageData) => {
    const { included, options } = baggageData;
    
    return [
      {
        id: 'standard',
        title: 'Standard',
        price: 0,
        description: 'Parfait pour les voyages légers',
        items: [
          {
            icon: 'suitcase',
            text: `1 bagage cabine ${included.cabin}`,
            detail: '(max 20 x 40 x 55 cm)',
            included: true
          },
          {
            icon: 'briefcase',
            text: `1x ${included.hand}`,
            detail: '(max 20 x 33 x 25 cm)',
            included: true
          }
        ]
      },
      {
        id: 'supplementaire',
        title: 'Supplémentaire',
        price: getOptionPrice(options, ['EXTRA_1', 'EXTRA_2']),
        description: 'Idéal pour les longs séjours',
        items: options.filter(opt => opt.code.includes('EXTRA')).map(opt => ({
          icon: 'suitcase',
          text: opt.label,
          detail: '(max 23kg, 158 cm total)',
          price: opt.price
        })).concat([
          {
            icon: 'briefcase',
            text: `1x ${included.hand}`,
            detail: '(max 20 x 33 x 25 cm)',
            included: true
          }
        ])
      },
      {
        id: 'excedent',
        title: 'Excédent',
        price: getOptionPrice(options, ['OVERWEIGHT']),
        description: 'Pour bagages spéciaux ou surpoids',
        items: options.filter(opt => opt.code === 'OVERWEIGHT').map(opt => ({
          icon: 'scale',
          text: opt.label,
          detail: '(entre 23 et 32 kg)',
          price: opt.price
        })).concat([
          {
            icon: 'briefcase',
            text: `1x ${included.hand}`,
            detail: '(max 20 x 33 x 25 cm)',
            included: true
          }
        ])
      }
    ];
  };

  const getOptionPrice = (options, codes) => {
    return options
      .filter(opt => codes.includes(opt.code))
      .reduce((total, opt) => total + opt.price, 0);
  };

  // Vos fonctions existantes restent les mêmes
  const getIcon = (iconType) => {
    switch (iconType) {
      case 'suitcase':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        );
      case 'briefcase':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
      case 'scale':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18" />
            <path d="m3 9 3-3 3 3" />
            <path d="m15 9 3-3 3 3" />
            <path d="M3 15h6" />
            <path d="M15 15h6" />
          </svg>
        );
      default:
        return null;
    }
  };

  const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );

  const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    if (selectedPlan && flightInfo) {
      const selectedPlanData = baggageOptions.find(plan => plan.id === selectedPlan);
      
      // Préparer les données pour le service externe
      const bookingData = {
        flightInfo: {
          id: flightInfo.id,
          from: flightInfo.from,
          to: flightInfo.to,
          departureTime: flightInfo.departureTime,
          arrivalTime: flightInfo.arrivalTime,
          price: flightInfo.price,
          flight_number: flightInfo.flight_number,
          airline: flightInfo.airline
        },
        baggageSelection: {
          plan: selectedPlanData.title,
          totalPrice: getTotalPrice(selectedPlanData),
          selectedOptions: selectedPlanData.items.filter(item => !item.included)
        },
        totalPrice: flightInfo.price + getTotalPrice(selectedPlanData)
      };

      console.log('Données pour réservation:', bookingData);
      
      // Stocker pour la page suivante
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      
      // Navigation vers la page formulaire
      navigate('/formulaire', { 
        state: bookingData
      });
    }
  };

  const getTotalPrice = (plan) => {
    if (plan.price !== null) {
      return plan.price;
    }
    return plan.items.reduce((total, item) => total + (item.price || 0), 0);
  };

  if (!flightInfo) {
    return (
      <div className="baggage-page">
        <Header currentStep={2} />
        <div className="loading">Chargement des informations du vol...</div>
      </div>
    );
  }

  return (
    <div className="baggage-page">
      <Header currentStep={2} />

      <div className="baggage-content">
        <div className="baggage-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeftIcon />
            Retour
          </button>
          <h2 className="baggage-title">Sélection des bagages</h2>
          <div className="route-info">
            <span className="departure">{flightInfo.from}</span>
            <span className="separator">→</span>
            <span className="arrival">{flightInfo.to}</span>
            <span className="flight-time">{flightInfo.departureTime} - {flightInfo.arrivalTime}</span>
          </div>
        </div>

        <div className="pricing-info">
          <div className="info-icon">
            <InfoIcon />
          </div>
          <div className="info-text">
            <strong>Tarifs transparents :</strong> Tous les prix sont indiqués en MAD et incluent les taxes
          </div>
        </div>

        <div className="baggage-cards">
          {baggageOptions.map((plan) => {
            const totalPrice = getTotalPrice(plan);
            
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`baggage-card ${selectedPlan === plan.id ? 'baggage-card-selected' : ''}`}
              >
                <div className="card-header">
                  <div className="card-title-section">
                    <div className="card-title">{plan.title}</div>
                    <div className="card-description">{plan.description}</div>
                  </div>
                  <div className="card-price-section">
                    <div className="card-price">{totalPrice.toLocaleString()} MAD</div>
                    <div className="price-detail">Supplément bagages</div>
                  </div>
                </div>
                
                <div className="card-list">
                  {plan.items.map((item, idx) => (
                    <div key={idx} className="card-item">
                      <div className="item-icon">
                        {getIcon(item.icon)}
                      </div>
                      <div className="item-text">
                        <div className="item-main">{item.text}</div>
                        {item.detail && <div className="item-detail">{item.detail}</div>}
                      </div>
                      <div className="item-price">
                        {item.included ? (
                          <span className="included">Inclus</span>
                        ) : item.price ? (
                          <span className="item-price-amount">{item.price.toLocaleString()} MAD</span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-total">
                  <span>Total bagages :</span>
                  <strong>{totalPrice.toLocaleString()} MAD</strong>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flight-price-summary">
          <div className="price-breakdown">
            <div className="price-item">
              <span>Vol {flightInfo.from} → {flightInfo.to}</span>
              <span>{flightInfo.price.toLocaleString()} MAD</span>
            </div>
            <div className="price-item">
              <span>Supplément bagages</span>
              <span>
                {selectedPlan ? 
                  `${getTotalPrice(baggageOptions.find(p => p.id === selectedPlan)).toLocaleString()} MAD` : 
                  '0 MAD'
                }
              </span>
            </div>
            <div className="price-total">
              <span>Total</span>
              <span>
                {flightInfo.price + (selectedPlan ? 
                  getTotalPrice(baggageOptions.find(p => p.id === selectedPlan)) : 0
                ).toLocaleString()} MAD
              </span>
            </div>
          </div>
        </div>

        <div className="baggage-actions">
          <button 
            className={`continue-button ${selectedPlan ? 'continue-button-active' : ''}`}
            onClick={handleContinue}
            disabled={!selectedPlan}
          >
            {selectedPlan ? 
              `Continuer - ${(flightInfo.price + getTotalPrice(baggageOptions.find(p => p.id === selectedPlan))).toLocaleString()} MAD` : 
              'Sélectionnez une option'
            }
          </button>
        </div>
      </div>
    </div>
  );
}