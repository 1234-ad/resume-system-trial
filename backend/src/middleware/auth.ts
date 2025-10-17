import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const payload = verifyToken(token);
      req.userId = payload.userId;
      req.userEmail = payload.email;
    } catch (err) {
      // Token invalid but don't block request
    }
  }
  next();
}
