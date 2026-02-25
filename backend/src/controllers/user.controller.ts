import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcryptjs';
import { USER_COLUMNS } from '../utils/columns';
import { RowDataPacket } from 'mysql2';
import { UserRequest } from '../middlewares/authMiddleware';

export type Role = 'professional' | 'customer' | 'superAdmin';

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  profession?: string;
  createdAt: string;
  updatedAt: string;
  street?: string;
  streetNumber?: string;
  city?: string;
}

// GET /users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(`SELECT ${USER_COLUMNS} FROM users`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = ? LIMIT 1`,
      [id],
    );

    // rows est maintenant typé comme RowDataPacket[]
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /users
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role = 'customer', profession, address } = req.body;

  try {
    // champs obligatoires
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // vérification mot de passe
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          'Password too weak. Must be at least 8 characters with uppercase, lowercase, number, and special character.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const street = role === 'professional' ? (address?.street ?? null) : null;
    const streetNumber = role === 'professional' ? (address?.streetNumber ?? null) : null;
    const city = role === 'professional' ? (address?.city ?? null) : null;

    const [result] = await db.execute(
      `INSERT INTO users (
        firstName,
        lastName,
        email,
        password,
        role,
        profession,
        street,
        streetNumber,
        city
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        role,
        role === 'professional' ? (profession ?? null) : null,
        street,
        streetNumber,
        city,
      ],
    );

    const insertId = (result as any).insertId;

    res.status(201).json({
      id: insertId,
      firstName,
      lastName,
      email,
      role,
      profession: role === 'professional' ? (profession ?? null) : null,
      address: role === 'professional' ? { street, streetNumber, city } : null,
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /users/:id
export const deleteUser = async (req: UserRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ✅ Autorisation
    const isOwner = req.user.userId === id;
    const isSuperAdmin = req.user.role === 'superAdmin';

    if (isSuperAdmin && isOwner) {
      return res.status(400).json({ message: 'SuperAdmin cannot delete himself' });
    }

    if (!isOwner && !isSuperAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Vérifier si l'utilisateur existe
    const [rows] = await db.execute('SELECT id FROM users WHERE id = ? LIMIT 1', [id]);

    const users = rows as any[];

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Supprimer l'utilisateur
    await db.execute('DELETE FROM users WHERE id = ?', [id]);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
