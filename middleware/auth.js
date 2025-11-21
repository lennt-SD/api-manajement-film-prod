const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman';

function authenticateToken(req, res, next) {
  // Ambil token dari header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  // Jika token tidak ada
  if (!token) {
    return res.status(401).json({
      error: 'Akses ditolak, token tidak ditemukan'
    });
  }

  // Verifikasi token
  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      console.error('JWT Verify Error:', err.message);
      return res.status(403).json({
        error: 'Token tidak valid atau sudah kedaluwarsa'
      });
    }

    // Simpan data user hasil decode ke req.user
    req.user = decodedPayload.user;
    next(); // Lanjut ke endpoint berikutnya
  });
}

module.exports = authenticateToken;
