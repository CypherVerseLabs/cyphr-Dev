import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET must be set');

function isJwtPayload(payload: any): payload is JwtPayload {
  return (
    payload &&
    typeof payload.userId === 'number' &&
    (typeof payload.address === 'string' || typeof payload.address === 'undefined') &&
    (typeof payload.isAdmin === 'boolean' || typeof payload.isAdmin === 'undefined')
  );
}

export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!isJwtPayload(decoded)) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.jwtUser = decoded;
    next();
  } catch (err: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('JWT verification failed:', err);
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
