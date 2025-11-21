require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db.js'); // Koneksi PostgreSQL (pg)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRole } = require('./middleware/auth.js');

const app = express();
const PORT = process.env.PORT || 3300;
const JWT_SECRET = process.env.JWT_SECRET;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

// === ROUTES ===
app.get('/status', (req, res) => {
  res.json({ ok: true, service: 'film-api' });
});

// === AUTH ROUTES (REGISTER) ===
app.post('/auth/register', async (req, res, next) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password || password.length < 6) {
    return res.status(400).json({
      error: 'Username dan password (min 6 char) harus diisi'
    });
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Query insert
    const sql = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, username
    `;

    const result = await db.query(sql, [
      username.toLowerCase(),
      hashedPassword,
      'user'
    ]);

    res.status(201).json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') {
      // 23505 = unique_violation PostgreSQL
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }
    next(err); // Pass ke middleware error
  }
});

// === RUN SERVER ===
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// === FALLBACK & ERROR HANDLING ===
app.use((req, res) => {
  res.status(404).json({ error: 'Rute tidak ditemukan' });
});

app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

// === RUN SERVER ===
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server aktif di http://localhost:${PORT}`);
});
