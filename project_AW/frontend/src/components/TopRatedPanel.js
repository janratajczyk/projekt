import React, { useEffect, useState } from 'react';
import './TopRatedPanel.css';
import axios from 'axios';

const TopRatedPanel = ({ isOpen, onClose, onSelectFilm }) => {
    const [topFilms, setTopFilms] = useState([]);

    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5000/api/top-rated')
                .then(res => setTopFilms(res.data))
                .catch(err => console.error('Błąd ładowania rankingu', err));
        }
    }, [isOpen]);

    return (
        <div className={`top-rated-panel ${isOpen ? 'open' : ''}`}>
            <div className="panel-header">
                <h3>Ranking filmów</h3>
                <button onClick={onClose}>×</button>
            </div>
            <ul>
                {topFilms.map((film, index) => (
                    <li key={film.id} onClick={() => onSelectFilm(film)}>
                        <span>{index + 1}.</span>
                        <div>
                            <strong>{film.title}</strong><br />
                            <span>{film.artist}</span>
                        </div>
                        <span className="rating">{film.averageRating.toFixed(1)}★</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopRatedPanel;
