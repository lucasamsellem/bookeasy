import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcryptjs';

// GET /users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, address, profession, created_at, updated_at FROM users'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /users
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role, address, profession } = req.body;

  try {
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans MySQL
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, role, address, profession)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role ?? 'customer', address ?? null, profession ?? null]
    );

    // Récupérer l'id généré
    const insertId = (result as any).insertId;

    res.status(201).json({
      id: insertId,
      name,
      email,
      role: role ?? 'customer',
      address: address ?? null,
      profession: profession ?? null,
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
