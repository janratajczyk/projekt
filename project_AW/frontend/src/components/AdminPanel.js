import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = ({ onBack, showToast }) => {
    const [users, setUsers] = useState([]);
    const [films, setFilms] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users').then(res => setUsers(res.data));
        axios.get('http://localhost:5000/api/films').then(res => setFilms(res.data));
    }, []);

    const handleDeleteFilm = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/films/${id}`);
            setFilms(prev => prev.filter(s => s._id !== id));
            showToast('Piosenka usunięta', 'success');
        } catch {
            showToast('Błąd przy usuwaniu', 'error');
        }
    };

    return (
        <div style={{ padding: 30 }}>
            <h2>Panel Administratora</h2>

            <h3>Użytkownicy</h3>
            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.username} ({user.email})</li>
                ))}
            </ul>

            <h3>Piosenki</h3>
            <ul>
                {films.map(film => (
                    <li key={film._id}>
                        <strong>{film.title}</strong> - {film.artist}
                        <button onClick={() => handleDeleteFilm(film._id)} style={{ marginLeft: 10 }}>Usuń</button>
                        <FilmRatings filmId={film._id} />
                    </li>
                ))}
            </ul>

            <button onClick={onBack} style={{ marginTop: 20 }}>Powrót</button>
        </div>
    );
};

const FilmRatings = ({ filmId }) => {
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/films/${filmId}/details`)
            .then(res => setRatings(res.data.detailedRatings || []))
            .catch(console.error);
    }, [filmId]);

    if (!ratings.length) return null;

    return (
        <ul style={{ marginTop: 5 }}>
            {ratings.map((r, i) => (
                <li key={i}>{r.username} – {r.value}/5</li>
            ))}
        </ul>
    );
};

export default AdminPanel;
