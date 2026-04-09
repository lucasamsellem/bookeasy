// 👉 Repository = requêtes SQL uniquement

import { db } from '../config/db';
import { User } from '../types/types';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  // ✔️ requêtes paramétrées (anti SQL injection)
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

  const users = rows as User[];
  return users.length ? users[0] : null;
};

export const createUser = async (user: Omit<User, 'id'>) => {
  const { firstName, lastName, email, password, role, city, street, streetNumber } = user;

  const [result] = await db.execute(
    `INSERT INTO users (firstName, lastName, email, password, role, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, password, role, city, street, streetNumber],
  );

  return result;
};
