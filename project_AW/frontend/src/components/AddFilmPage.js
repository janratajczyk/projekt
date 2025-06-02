import React from 'react';
import AddFilmForm from './AddFilmForm';
import './FilmDetails.css';

function AddFilmPage({ onAddFilm, showToast, onBack }) {
    return (
        <div style={{ padding: '30px' }}>
            <AddFilmForm onAddFilm={onAddFilm} showToast={showToast} />
            <div className="center-container">
                <button onClick={onBack} className="back-button">
                    Powrót
                </button>
            </div>
        </div>
    );
}

export default AddFilmPage;
