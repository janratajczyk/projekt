import React, { useState } from 'react';
import axios from 'axios';
import './AddFilmForm.css';

function AddFilmForm({ onAddFilm, showToast }) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [category, setCategory] = useState('');
    const [schauspiller, setSchauspiller] = useState('');


    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        try
        {
            const res = await axios.post('http://localhost:5000/api/films', { title, artist, category,schauspiller });
            onAddFilm(res.data);
            showToast('Film dodany', 'success');
            setTitle('');
            setArtist('');
            setCategory('');
            setSchauspiller('');
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
                placeholder="Tytuł filmu"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Rezyser"
                value={artist}
                onChange={e => setArtist(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Głowny aktor"
                value={schauspiller}
                onChange={e => setSchauspiller(e.target.value)}
                required
            />
            <input
                type="text"
                list="filmCategories"
                placeholder="Kategoria"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
            />
            <datalist id="filmCategories">
                <option value="Akcja"/>
                <option value="Komedia"/>
                <option value="Dramat"/>
                <option value="Horror"/>
                <option value="Science Fiction"/>
                <option value="Romans"/>
                <option value="Animowany"/>
                <option value="Dokumentalny"/>
            </datalist>
            <button type="submit">Dodaj</button>
        </form>
    );
}

export default AddFilmForm;
