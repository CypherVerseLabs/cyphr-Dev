import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  address: string;
  isAdmin?: boolean; // Optional for backward compatibility
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

function isJwtPayload(payload: any): payload is JwtPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof payload.userId === 'number' &&
    typeof payload.address === 'string' &&
    (typeof payload.isAdmin === 'boolean' || typeof payload.isAdmin === 'undefined')
  );
}

export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!isJwtPayload(decoded)) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('JWT verification failed:', err);
    }
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
