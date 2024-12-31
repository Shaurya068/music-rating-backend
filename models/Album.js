
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: String,
    duration: String,
    artist: String,
    rating: { type: Number, default: 0 }
});

const albumSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    description: String,
    image: String,
    songs: [songSchema]
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
