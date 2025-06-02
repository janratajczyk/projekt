const express = require('express');
const router = express.Router();
const Film = require('../models/Film');

router.get('/', async (req, res) => {
    try {
        const films = await Film.find();
        res.json(films);
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

router.post('/', async (req, res) => {
    const { title, artist } = req.body;
    if (!title || !artist) {
        return res.status(400).json({ error: 'Tytuł i wykonawca są wymagane' });
    }
    try {
        const newFilm = new Film({
            title,
            artist,
            ratings: [],
            averageRating: 0,
        });
        await newFilm.save();
        res.status(201).json(newFilm);
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

router.post('/:id/rate', async (req, res) => {
    const filmId = req.params.id;
    const { userId, rating } = req.body;

    if (!userId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Nieprawidłowe dane oceny' });
    }

    try {
        const film = await Film.findById(filmId);
        if (!film) return res.status(404).json({ error: 'Piosenka nie znaleziona' });

        const existingRating = film.ratings.find(r => r.userId.toString() === userId);
        if (existingRating) {
            existingRating.value = rating;
        } else {
            film.ratings.push({ userId, value: rating });
        }

        const sum = film.ratings.reduce((acc, r) => acc + r.value, 0);
        film.averageRating = sum / film.ratings.length;

        await film.save();
        res.json(film);
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const filmId = req.params.id;
        await Film.findByIdAndDelete(filmId);
        res.json({ message: 'Piosenka usunięta' });
    } catch (err) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

module.exports = router;
