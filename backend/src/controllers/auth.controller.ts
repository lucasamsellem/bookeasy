import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../config/db'; // pool MySQL
import { generateToken } from '../utils/jwt';
import { User } from './user.controller';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Rechercher l'utilisateur dans MySQL
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);

    const users = rows as any[];
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0] as User;

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Générer le token JWT
    const token = generateToken(user.id.toString(), user.role);

    // 🔐 Cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 jour
    });

    // Répondre avec token et infos utilisateur
    res.json({
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
