import jwt from 'jsonwebtoken';

// Token-based guard for /api/admin/*
export default function adminAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
}

