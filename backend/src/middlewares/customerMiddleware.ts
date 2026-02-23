import { Response, NextFunction } from 'express';
import { UserRequest } from './authMiddleware';

// This middleware checks if the user is a customer

export const customerMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Unauthorized. User is not a customer' });
  }

  next();
};
