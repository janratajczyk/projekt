import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilmDetails.css';

const FilmDetails = ({ film: initialFilm, onBack, showToast, user, onUpdateFilm }) => {
    const [film, setFilm] = useState(initialFilm);
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);


    useEffect(() => {
        setFilm(initialFilm);
        if (initialFilm.ratings) {
            const userRating = initialFilm.ratings.find(r => r.userId === user._id);
            setRating(userRating ? userRating.value : 0);
        } else {
            setRating(0);
        }
        setHovered(0);
    }, [initialFilm, user._id]);

    const handleSaveRating = async () => {
        if (rating < 1 || rating > 5) {
            showToast('Wybierz ocenę od 1 do 5', 'error');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/films/${film._id}/rate`, {
                userId: user._id,
                rating,
            });

            setFilm(response.data);
            onUpdateFilm(response.data);

            showToast('Ocena zapisana', 'success');
        } catch (error) {
            showToast('Błąd zapisu oceny', 'error');
        }
    };

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <span
                    key={starValue}
                    className={`star ${starValue <= (hovered || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHovered(starValue)}
                    onMouseLeave={() => setHovered(0)}
                    style={{ cursor: 'pointer' }}
                >
                    ★
                </span>
            );
        });
    };

    return (
        <div className="film-details">
            <button className="back-button" onClick={onBack}>
                ← Powrót
            </button>
            <h2>{film.title}</h2>
            <p>
                <b>Wykonawca:</b> {film.artist}
            </p>
            <p><strong>Kategoria:</strong> {film.category}</p>

            <p><strong>Główny aktor:</strong> {film.schauspiller}</p>

            <p>
                <b>Średnia ocena:</b> {film.averageRating?.toFixed(2) || 'Brak'} ⭐
            </p>

            <div className="rating">
                <label>Twoja ocena:</label>
                <div className="star-rating">{renderStars()}</div>
            </div>

            <button className="save-button" onClick={handleSaveRating}>
                Zapisz ocenę
            </button>
        </div>
    );
};

export default FilmDetails;
