const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Music = require('./models/music');

const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/musicDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.use(express.static(path.join(__dirname, 'client/build')));


app.get('/api/albums', async (req, res) => {
    try {
        const albums = await Music.find();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching albums', error: err });
    }
});


app.get('/api/albums/:id', async (req, res) => {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid album ID format' });
    }

    try {
        const album = await Music.findById(id);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }
        res.json(album);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching album', error: err });
    }
});


app.post('/api/albums', async (req, res) => {
    const { title, artist, genre, image, description } = req.body;

    try {
        const newAlbum = new Music({
            title,
            artist,
            genre,
            image,
            description,
            songs: [],
        });

        await newAlbum.save();
        res.status(201).json(newAlbum);
    } catch (err) {
        res.status(500).json({ message: 'Error adding album', error: err });
    }
});


app.post('/api/albums/:id/songs', async (req, res) => {
    const { id } = req.params;
    const { title, artist, duration } = req.body;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid album ID format' });
    }

    try {
        const album = await Music.findById(id);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        const newSong = { title, artist, duration };

        album.songs.push(newSong);
        await album.save();

        res.status(201).json(album);
    } catch (err) {
        res.status(500).json({ message: 'Error adding song to album', error: err });
    }
});


app.delete('/api/albums/:id/songs/:songId', async (req, res) => {
    const { id, songId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(songId)) {
        return res.status(400).json({ message: 'Invalid album or song ID format' });
    }

    try {

        const album = await Music.findById(id);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }


        const updatedSongs = album.songs.filter(song => song._id.toString() !== songId);


        if (updatedSongs.length === album.songs.length) {
            return res.status(404).json({ message: 'Song not found in album' });
        }


        album.songs = updatedSongs;
        await album.save();


        res.status(200).json(album);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting song from album', error: err });
    }
});


app.delete('/api/albums/:id', async (req, res) => {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid album ID format' });
    }

    try {

        const album = await Music.findByIdAndDelete(id);

        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        res.status(200).json({ message: 'Album deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting album', error: err });
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});


app.listen(3001, () => {
    console.log('Server running on port 3001');
});
