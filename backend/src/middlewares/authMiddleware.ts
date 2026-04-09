import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../types/types';

export interface UserRequest extends Request {
  user?: { userId: string; role: Role };
}

export const authMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {
  // 👇 Lire depuis le cookie en priorité
  const token = req.cookies?.token ?? req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'User not authenticated' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: Role;
    };

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide' });
  }
};
