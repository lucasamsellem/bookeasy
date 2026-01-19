import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcryptjs';
import { USER_COLUMNS } from '../utils/columns';
import { RowDataPacket } from 'mysql2';

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
export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role = 'customer', profession, address } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const street = role === 'professional' ? (address?.street ?? null) : null;
    const streetNumber = role === 'professional' ? (address?.streetNumber ?? null) : null;
    const city = role === 'professional' ? (address?.city ?? null) : null;

    const [result] = await db.execute(
      `INSERT INTO users (
        first_name,
        last_name,
        email,
        password,
        role,
        profession,
        street,
        street_number,
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
      address:
        role === 'professional'
          ? {
              street,
              streetNumber,
              city,
            }
          : null,
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
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Vérifier si l'utilisateur existe
    const [rows] = await db.execute('SELECT id FROM users WHERE id = ? LIMIT 1', [id]);
    const users = rows as any[];
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Supprimer l'utilisateur
    await db.execute('DELETE FROM users WHERE id = ?', [id]);

    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
