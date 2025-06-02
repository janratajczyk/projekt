import React from 'react';
import './FilmList.css';

const FilmList = ({ films, onSelectFilm }) => {
    return (
        <div className="film-list">
            {films.map(film => (
                <div key={film._id} className="film-card">
                    <h3>{film.title}</h3>
                    <p>{film.artist}</p>
                    <button onClick={() => onSelectFilm(film)}><b>Szczegóły</b></button>
                </div>
            ))}
        </div>
    );
};

export default FilmList;
