// 👉 Repository = requêtes SQL uniquement

import { db } from '../config/db';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'professional' | 'customer';
  address?: string;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  // ✔️ requêtes paramétrées (anti SQL injection)
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

  const users = rows as User[];
  return users.length ? users[0] : null;
};

export const createUser = async (user: Omit<User, 'id'>) => {
  const { name, email, password, role, address } = user;

  const [result] = await db.execute(
    `INSERT INTO users (name, email, password, role, address)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, password, role, address]
  );

  return result;
};
