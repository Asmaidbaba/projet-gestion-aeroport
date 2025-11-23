import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './views/Home';
import FlightList from './views/FlightList';
import ConfirmationReservations from './views/ConfirmationReservations';
import './App.css';
import AjouteVol from './views/AjouteVol';
import Register from './views/Register';
import Login from './views/Login';
import Formulaire from './views/Formulaire';
import BagageSelection from './views/BagageSelection';
import FlightDetails from './views/FlightDetails';
import ReservationTicket from './views/ReservationTicket';
import PassengerList from './views/PassengerList';
import VolsDisponibles from './views/VolsDisponible';
import EditVol from './views/EditVol';

// URL de votre backend Spring Boot
const API_URL = 'http://localhost:9090/api/users';

// cette fonction permet de basculer entre register et login 
function AuthApp() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    switch(currentPage) {
      case 'register':
        return <Register onNavigate={setCurrentPage} />;
      case 'login':
      default:
        return <Login onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route d'authentification par défaut */}
          <Route path="/" element={<AuthApp />} />
          <Route path="/auth" element={<AuthApp />} />
          
          {/* Route pour le formulaire */}
          <Route path="/formulaire" element={<Formulaire/>} />
          
          {/* Route pour bagage */}
          <Route path="/bagage" element={<BagageSelection />} />
          
          {/* Redirections optionnelles */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          
          {/* Autres routes de l'application */}
          <Route path="/home" element={<Home />} />
          <Route path="/results" element={<FlightList />} />
          <Route path="/confirmation" element={<ConfirmationReservations />} />
          <Route path="/addvol" element={<AjouteVol />} />
          <Route path="/flightDetails" element={<FlightDetails/>}/>
          <Route path="/reservationTicket" element={<ReservationTicket/>}/>
          <Route path="/passengers" element={<PassengerList/>}/>
          <Route path="/bagage" element={<BagageSelection/>}/>
          <Route path="/disponiblevols" element={<VolsDisponibles/>}/>
          <Route path="/editvol" element={<EditVol />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;