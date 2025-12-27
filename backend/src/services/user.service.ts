import { db } from '../config/db';
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, address, profession, created_at, updated_at FROM users'
  );
  return rows;
};

export const getUserById = async (id: number) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, address, profession, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  const users = rows as any[];
  return users.length > 0 ? users[0] : null;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: 'professional' | 'customer';
  address?: string;
  profession?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const [result] = await db.execute(
    `INSERT INTO users (name, email, password, role, address, profession)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.email,
      hashedPassword,
      data.role ?? 'customer',
      data.address ?? null,
      data.profession ?? null,
    ]
  );

  const insertId = (result as any).insertId;
  return {
    id: insertId,
    name: data.name,
    email: data.email,
    role: data.role ?? 'customer',
    address: data.address ?? null,
    profession: data.profession ?? null,
  };
};

export const deleteUser = async (id: number) => {
  await db.execute('DELETE FROM users WHERE id = ?', [id]);
};
