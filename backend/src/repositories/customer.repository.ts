// backend/src/repositories/customer.repository.ts
import { db } from '../config/db';
import { USER_COLUMNS } from '../utils/columns';

export const customerRepository = {
  getProfessionals: async () => {
    const [rows] = await db.execute(
      `SELECT ${USER_COLUMNS} FROM users WHERE role = 'professional'`,
    );
    return rows;
  },
};
