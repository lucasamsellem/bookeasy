import { NextFunction, Response } from 'express';
import { UserRequest } from './authMiddleware';
import { Role } from '../controllers/user.controller';

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (req.user.role === 'superAdmin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    return next();
  };
};
