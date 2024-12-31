
const mongoose = require('mongoose');


const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  duration: String,
});


const albumSchema = new mongoose.Schema({
  title: String,
  artist: String,
  genre: String,
  image: String,
  description: String,
  songs: [songSchema],
});


const Music = mongoose.model('Music', albumSchema);

module.exports = Music;
