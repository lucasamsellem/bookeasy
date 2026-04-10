import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db'; // pool MySQL
import { generateToken } from '../utils/jwt';
import { User } from '../types/types';

function validateLoginInputs(email: string, password: string): string | null {
  if (!email || !password) return 'Champs manquants';
  if (typeof email !== 'string' || typeof password !== 'string') return 'Type invalide';
  if (email.length > 254) return 'Email trop long'; // RFC 5321
  if (password.length > 128) return 'Mot de passe trop long'; // évite les bcrypt DoS
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email invalide';
  return null;
}

export const login = async (req: Request, res: Response) => {
  console.log('req.body:', req.body);
  console.log('req.headers:', req.headers);
  const { email, password } = req.body;

  const error = validateLoginInputs(email, password);
  if (error) return res.status(400).json({ message: error });

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const users = rows as User[];

    const user = users[0];
    const hash = user?.password ?? '$2b$10$invalidhashpadding000000000000000'; // évite le timing attack

    const isValid = user && (await bcrypt.compare(password, hash));
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id.toString(), user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};
