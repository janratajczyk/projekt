import React, { useState } from 'react';
import axios from 'axios';
import './AddFilmForm.css';

function AddFilmForm({ onAddFilm, showToast }) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        try
        {
            const res = await axios.post('http://localhost:5000/api/films', { title, artist });
            onAddFilm(res.data);
            showToast('Film dodany', 'success');
            setTitle('');
            setArtist('');
        }
        catch (err)
        {
            showToast('Błąd przy dodawaniu', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-film-form">
            <h3>Dodaj nowy Film</h3>
            <input
                type="text"
                placeholder="Tytuł"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Artysta"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                required
            />
            <button type="submit">Dodaj</button>
        </form>
    );
}

export default AddFilmForm;
