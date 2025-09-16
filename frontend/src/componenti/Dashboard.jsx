import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // ✅ Importa il file CSS

const Dashboard = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || 'Utente';
  const token = localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleFilmCatalog = () => {
    if (!token) {
      alert('Devi effettuare il login prima');
      navigate('/');
      return;
    }
    navigate('/filmCatalog');
  };

  const handleRentals = () => {
    if (!token) {
      alert('Devi effettuare il login prima');
      navigate('/');
      return;
    }
    navigate('/rentals');
  };

  return (
    <div className="dashboard-container"> {/* ✅ Sostituito lo stile inline con una classe */}
      <header className="dashboard-header"> {/* ✅ Sostituito lo stile inline */}
        <h1 className="dashboard-title">Dashboard</h1> {/* ✅ Aggiunto classe per il titolo */}
        <div className="user-section"> 
          <span className="welcome-message">Ciao, {username}!</span> 
          <button 
            onClick={handleLogout}
            className="logout-btn" 
          >
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-sections"> 
        <div className="dashboard-card"> 
          <h3>Catalogo Film</h3>
          <p>Esplora e gestisci il catalogo dei film</p>
          <button 
            onClick={handleFilmCatalog}
            className="card-button primary" 
          >
            Vai al Catalogo
          </button>
        </div>

        <div className="dashboard-card"> 
          <h3>I miei Noleggi</h3>
          <p>Visualizza lo storico dei tuoi noleggi</p>
          <button 
            onClick={handleRentals}
            className="card-button rentals" 
          >
            Vai ai Noleggi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;