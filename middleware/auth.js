const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman';

// === Middleware: Validasi Token JWT ===
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak, token tidak ditemukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
    }

    req.user = decodedPayload.user;
    next();
  });
}

// === Middleware: Cek Role User ===
function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Akses ditolak, role tidak sesuai' });
    }
    next();
  };
}

// === Export beberapa function ===
module.exports = {
  authenticateToken,
  authorizeRole
};
