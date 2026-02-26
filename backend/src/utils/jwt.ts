import jwt from 'jsonwebtoken';
import { Role } from '../controllers/user.controller';

export const generateToken = (userId: string, role: Role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};
