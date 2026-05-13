import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }
  return secret;
}

export function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (e) {
    return null;
  }
}

export function getAuthFromRequest(request) {
  const h = request.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return null;
  return verifyToken(token);
}
