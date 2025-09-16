import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componenti/Login';
import Dashboard from './componenti/Dashboard'; // Assicurati di avere questo componente
import Rental from './componenti/Rental'; // Importa il nuovo componente
import FilmCatalog from './componenti/FilmCatalog' ; // Se hai un catalogo

// Componente per la rotta protetta
const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('authToken');
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />
                
                {/* Rotte protette */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/rentals"
                    element={
                        <PrivateRoute>
                            <Rental />
                        </PrivateRoute>
                    }
                />
                 <Route
                    path="/filmCatalog"
                    element={
                        <PrivateRoute>
                            <FilmCatalog />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;