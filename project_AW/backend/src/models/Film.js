const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
});

const filmSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Film', filmSchema);
