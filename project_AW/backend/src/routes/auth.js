const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.post('/register', async (req, res) => {
    const { username, password, code } = req.body;

    if (code !== '123') {
        return res.status(400).json({ message: 'Niepoprawny kod uwierzytelniający' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Użytkownik już istnieje' });
    }

    const user = new User({ username, password, role: 'user' }); // hasło w plain text
    await user.save();

    res.json({ message: 'Rejestracja zakończona pomyślnie' });
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Zalogowano pomyślnie', user });
});

module.exports = router;
