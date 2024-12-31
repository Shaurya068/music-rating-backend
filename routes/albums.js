const express = require('express');
const Music = require('../models/music');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const albums = await Music.find();
        res.json(albums);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching albums', error: err });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
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

router.post('/', async (req, res) => {
    const { title, artist, genre, image, description } = req.body;

    try {
        const newAlbum = new Music({
            title,
            artist,
            genre,
            image,
            description
        });

        await newAlbum.save();
        res.status(201).json(newAlbum);
    } catch (err) {
        res.status(500).json({ message: 'Error adding album', error: err });
    }
});

router.post('/:id/songs', async (req, res) => {
    const { id } = req.params;
    const { title, artist, duration } = req.body;

    try {
        const album = await Music.findById(id);
        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        const newSong = { title, artist, duration, id: Date.now() };

        album.songs.push(newSong);
        await album.save();

        res.status(201).json(album);
    } catch (err) {
        res.status(500).json({ message: 'Error adding song to album', error: err });
    }
});

module.exports = router;
