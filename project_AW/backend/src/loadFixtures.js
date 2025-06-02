require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');
const Film = require('./models/Film');

async function loadFixtures() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/filmReview';
        await mongoose.connect(mongoUri);

        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Film.deleteMany({});

        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'users.json')));
        const filmsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'films.json')));

        for (const userData of usersData) {
            const user = new User({
                _id: new mongoose.Types.ObjectId(userData._id),
                username: userData.username,
                password: userData.noHash ? userData.password : userData.password, // tu możesz dodać hashowanie
                role: userData.role || 'user',
            });
            await user.save();
        }

        for (const filmData of filmsData) {
            const film = new Film({
                title: filmData.title,
                artist: filmData.artist,
                ratings: filmData.ratings.map(r => ({
                    userId: new mongoose.Types.ObjectId(r.userId),
                    value: r.value,
                })),
                averageRating: filmData.averageRating || 0,
            });
            await film.save();
        }

        console.log('Fixtures loaded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error loading fixtures:', err);
        process.exit(1);
    }
}

loadFixtures();
