import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcryptjs';
import { USER_COLUMNS } from '../utils/columns';
import { RowDataPacket } from 'mysql2';
import { UserRequest } from '../middlewares/authMiddleware';

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
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'\-]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CITY_REGEX = /^[a-zA-ZÀ-ÿ\s'\-]{2,100}$/;
const STREET_REGEX = /^[a-zA-ZÀ-ÿ0-9\s'\-,\.]{2,150}$/;
const STREET_NUMBER_REGEX = /^[0-9]{1,5}[a-zA-Z]?$/;
const PROFESSION_REGEX = /^[a-zA-ZÀ-ÿ\s'\-]{2,100}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const buildUserPayload = async (body: any, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = 'customer',
    profession,
    street: bodyStreet,
    streetNumber: bodyStreetNumber,
    city: bodyCity,
  } = body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validations format
    if (!NAME_REGEX.test(firstName)) {
      return res.status(400).json({ message: 'Invalid firstName: letters only, 2–50 chars.' });
    }
    if (!NAME_REGEX.test(lastName)) {
      return res.status(400).json({ message: 'Invalid lastName: letters only, 2–50 chars.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          'Password too weak. Must be at least 8 characters with uppercase, lowercase, number, and special character.',
      });
    }

    // Validations pro
    if (role === 'professional') {
      if (profession && !PROFESSION_REGEX.test(profession)) {
        return res.status(400).json({ message: 'Invalid profession format.' });
      }
      if (bodyStreet && !STREET_REGEX.test(bodyStreet)) {
        return res.status(400).json({ message: 'Invalid street format.' });
      }
      if (bodyStreetNumber && !STREET_NUMBER_REGEX.test(bodyStreetNumber)) {
        return res.status(400).json({ message: 'Invalid street number format.' });
      }
      if (bodyCity && !CITY_REGEX.test(bodyCity)) {
        return res.status(400).json({ message: 'Invalid city format.' });
      }
    }

    // Vérification email existant
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [
      email.toLowerCase().trim(),
    ]);

    if ((existingUsers as any[]).length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const street = role === 'professional' ? bodyStreet : null;
    const streetNumber = role === 'professional' ? bodyStreetNumber : null;
    const city = role === 'professional' ? bodyCity : null;

    const [result] = await db.execute(
      `INSERT INTO users (firstName, lastName, email, password, role, profession, street, streetNumber, city)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email.toLowerCase().trim(),
        hashedPassword,
        role,
        role === 'professional' ? (profession ?? null) : null,
        street,
        streetNumber,
        city,
      ],
    );

    const insertId = (result as any).insertId;

    return res.status(201).json({
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
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  return buildUserPayload(req.body, res);
};

export const createUserFromAdmin = async (req: UserRequest, res: Response) => {
  return buildUserPayload(req.body, res);
};

// PUT /users/:id
export const updateUserByAdmin = async (req: UserRequest, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, city, street, streetNumber } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 🔐 Autorisation : uniquement superAdmin
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Vérifier existence user
    const [rows] = await db.execute('SELECT id FROM users WHERE id = ? LIMIT 1', [id]);

    const users = rows as any[];

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update uniquement les champs autorisés
    await db.execute(
      `
      UPDATE users
      SET firstName = ?,
          lastName = ?,
          city = ?,
          street = ?,
          streetNumber = ?
      WHERE id = ?
      `,
      [firstName ?? null, lastName ?? null, city ?? null, street ?? null, streetNumber ?? null, id],
    );

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
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
