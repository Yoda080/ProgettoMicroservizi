import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rental.css';

const Rental = () => {
    // Stato per i noleggi esistenti
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Stato per la logica di noleggio
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState('');
    const [renting, setRenting] = useState(false);

    const RENTALS_API_URL = "http://localhost:5003/api/Rentals";
    const MOVIES_API_URL = "http://localhost:5002/api/movies";

    const handleRentMovie = async (e) => {
        e.preventDefault();
        setRenting(true);
        setError(null);
        if (!selectedMovieId) {
            setError("Seleziona un film.");
            setRenting(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Autenticazione necessaria. Effettua il login.");
                setRenting(false);
                navigate('/login');
                return;
            }

            const response = await fetch(RENTALS_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                // Il backend dovrebbe generare automaticamente la data del noleggio e la data di scadenza.
                // Invia solo l'ID del film.
                body: JSON.stringify({ movieId: parseInt(selectedMovieId) })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Errore HTTP: ${response.status}`);
            }

            // Aggiorna la lista dei noleggi dopo un noleggio andato a buon fine
            const rentalsResponse = await fetch(RENTALS_API_URL, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const rentalsData = await rentalsResponse.json();
            setRentals(rentalsData);

            alert("Film noleggiato con successo!");
            setSelectedMovieId('');

        } catch (err) {
            setError(err.message);
            console.error("Errore noleggio film:", err.message);
        } finally {
            setRenting(false);
        }
    };

    const handleReturnMovie = async (rentalId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Autenticazione necessaria.");
                return;
            }

            const response = await fetch(`${RENTALS_API_URL}/return/${rentalId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Errore HTTP: ${response.status}`);
            }

            setRentals(prevRentals =>
                prevRentals.map(rental =>
                    rental.id === rentalId ? { ...rental, returnedAt: new Date().toISOString() } : rental
                )
            );
            alert("Film restituito con successo!");

        } catch (err) {
            setError(err.message);
            console.error("Errore restituzione film:", err.message);
        }
    };

    useEffect(() => {
        const fetchRentalsAndMovies = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError("Autenticazione necessaria. Effettua il login.");
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                const rentalsResponse = await fetch(RENTALS_API_URL, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!rentalsResponse.ok) throw new Error(`Errore HTTP: ${rentalsResponse.status}`);
                const rentalsData = await rentalsResponse.json();
                setRentals(rentalsData);

                const moviesResponse = await fetch(MOVIES_API_URL, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!moviesResponse.ok) throw new Error(`Errore HTTP: ${moviesResponse.status}`);
                const moviesData = await moviesResponse.json();
                setMovies(moviesData);

            } catch (err) {
                setError(err.message);
                console.error("Errore fetch dati:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRentalsAndMovies();
    }, [navigate]);

    if (loading) {
        return <div className="rental-container">Caricamento noleggi...</div>;
    }

    if (error) {
        return <div className="rental-container error-message">{error}</div>;
    }

    return (
        <div className="rental-container">
            <header className="rental-header">
                <h1>I miei Noleggi</h1>
                  
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="back-button" 
                >
                    Torna alla Dashboard
                </button>
            </header>

            <div className="rental-form">
                <h2>Noleggia un nuovo film</h2>
                <form onSubmit={handleRentMovie}>
                    <div>
                        <label htmlFor="movie-select">Scegli un film:</label>
                        <select
                            id="movie-select"
                            value={selectedMovieId}
                            onChange={(e) => setSelectedMovieId(e.target.value)}
                            required
                        >
                            <option value="">-- Seleziona un film --</option>
                            {movies.map(movie => (
                                <option key={movie.id} value={movie.id}>
                                    {movie.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" disabled={renting}>
                        {renting ? 'Noleggio in corso...' : 'Noleggia'}
                    </button>
                </form>
            </div>

            <div className="rental-content">
                {rentals.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Film ID</th>
                                <th>Data Noleggio</th>
                                <th>Data Scadenza</th>
                                <th>Restituito/Restituire</th>
                                <th>Prezzo Totale</th>
                            </tr>
                        </thead>
                    
                        <tbody>
                            {rentals.map((rental) => (
                                <tr key={rental.id}>
                                    <td>{rental.movieId}</td>
                                    <td>{new Date(rental.rentedAt).toLocaleDateString()}</td>
                                    <td>{new Date(rental.dueDate).toLocaleDateString()}</td>
                                    <td>
                                        {rental.returnedAt ? 'Restituito' : (
                                            <button onClick={() => handleReturnMovie(rental.id)}>Restituisci</button>
                                        )}
                                    </td>
                                    <td>€ {rental.totalPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Non hai ancora noleggiato film.</p>
                )}
            </div>
        </div>
    );
};

export default Rental;