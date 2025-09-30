import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest, JwtPayload } from '../types/auth'

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const JWT_SECRET = process.env.JWT_SECRET

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not set')
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    req.jwtUser = decoded // Now using your typed field
    next()
  } catch (err) {
    console.error('JWT verification failed:', err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ✅ Re-export your custom type
export type { AuthenticatedRequest }
