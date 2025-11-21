const express = require('express');
const app = express();
const PORT = 3000;

// Middleware agar bisa membaca JSON dari body request
app.use(express.json());

// =====================
// Data Dummy
// =====================
let movies = [
    { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
    { id: 2, title: 'Parasite', director: 'Bong Joon-ho', year: 2019 },
    { id: 3, title: 'Spirited Away', director: 'Hayao Miyazaki', year: 2001 },
    { id: 4, title: 'Pulp Fiction', director: 'Quentin Tarantino', year: 1994 },
    { id: 5, title: 'Schindler\'s List', director: 'Steven Spielberg', year: 1993 }
];

let directors = [
    { id: 1, name: 'Christopher Nolan', country: 'UK' },
    { id: 2, name: 'Bong Joon-ho', country: 'South Korea' },
    { id: 3, name: 'Hayao Miyazaki', country: 'Japan' },
    { id: 4, name: 'Quentin Tarantino', country: 'USA' },
    { id: 5, name: 'Steven Spielberg', country: 'USA' }
];

// =====================
// Routes
// =====================
app.get('/', (req, res) => {
    res.send('Server API Manajemen Film & Sutradara berjalan!');
});

// =====================
// Movies Endpoint
// =====================
app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = movies.find(m => m.id === movieId);
    if (!movie) {
        return res.status(404).json({ message: 'Film tidak ditemukan' });
    }
    res.json(movie);
});

app.post('/movies', (req, res) => {
    console.log("REQUEST BODY:", req.body); // Debug

    const { title, director, year } = req.body;
    if (!title || !director || !year) {
        return res.status(400).json({ 
            message: "Semua field (title, director, year) harus diisi" 
        });
    }

    const newId = movies.length > 0 ? movies[movies.length - 1].id + 1 : 1;
    const newMovie = { id: newId, title, director, year };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Film tidak ditemukan' });
    }

    const { title, director, year } = req.body;
    if (!title || !director || !year) {
        return res.status(400).json({ message: 'Semua field (title, director, year) harus diisi untuk pembaruan' });
    }

    const updatedMovie = { id: movieId, title, director, year };
    movies[movieIndex] = updatedMovie;
    res.status(200).json(updatedMovie);
});

app.delete('/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = movies.findIndex(m => m.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Film tidak ditemukan' });
    }

    movies.splice(movieIndex, 1);
    res.status(204).send();
});

// =====================
// Directors Endpoint
// =====================
app.get('/directors', (req, res) => {
    res.json(directors);
});

app.get('/directors/:id', (req, res) => {
    const directorId = parseInt(req.params.id);
    const director = directors.find(d => d.id === directorId);
    if (!director) {
        return res.status(404).json({ message: 'Sutradara tidak ditemukan' });
    }
    res.json(director);
});

app.post('/directors', (req, res) => {
    console.log("REQUEST BODY:", req.body); // Debug

    const { name, country } = req.body;
    if (!name || !country) {
        return res.status(400).json({ message: "Semua field (name, country) harus diisi" });
    }

    const newId = directors.length > 0 ? directors[directors.length - 1].id + 1 : 1;
    const newDirector = { id: newId, name, country };
    directors.push(newDirector);
    res.status(201).json(newDirector);
});

app.put('/directors/:id', (req, res) => {
    const directorId = parseInt(req.params.id);
    const directorIndex = directors.findIndex(d => d.id === directorId);

    if (directorIndex === -1) {
        return res.status(404).json({ message: 'Sutradara tidak ditemukan' });
    }

    const { name, country } = req.body;
    if (!name || !country) {
        return res.status(400).json({ message: 'Semua field (name, country) harus diisi untuk pembaruan' });
    }

    const updatedDirector = { id: directorId, name, country };
    directors[directorIndex] = updatedDirector;
    res.status(200).json(updatedDirector);
});

app.delete('/directors/:id', (req, res) => {
    const directorId = parseInt(req.params.id);
    const directorIndex = directors.findIndex(d => d.id === directorId);

    if (directorIndex === -1) {
        return res.status(404).json({ message: 'Sutradara tidak ditemukan' });
    }

    directors.splice(directorIndex, 1);
    res.status(204).send();
});

// =====================
// Run Server
// =====================
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
