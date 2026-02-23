import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserRequest extends Request {
  user?: { id: string; role: 'customer' | 'professional' };
}

export const authMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'User not authenticated' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: 'customer' | 'professional';
    };

    // stocke les infos user pour les autres middlewares
    req.user = payload;

    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide' });
  }
};
