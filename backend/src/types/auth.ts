import { Request } from 'express';

export interface JwtPayload {
  userId: number;
  address: string;
  isAdmin?: boolean;
}

export interface AuthenticatedRequest extends Request {
  jwtUser?: JwtPayload;
}
