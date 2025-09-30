import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.jwtUser?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
