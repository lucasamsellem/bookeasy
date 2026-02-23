import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || token === 'null')
    return res.status(401).json({ message: 'User not authenticated' });
  next();
};
