import { Response, NextFunction } from 'express';
import { UserRequest } from './authMiddleware';

// This middleware checks if the user is a professional

export const proMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (req.user.role !== 'professional') {
    return res.status(403).json({ message: 'Unauthorized. User is not a professional' });
  }

  next();
};
