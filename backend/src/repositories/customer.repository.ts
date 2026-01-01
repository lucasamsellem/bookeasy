// backend/src/repositories/customer.repository.ts
import { db } from '../config/db';

export const customerRepository = {
  getProfessionals: async () => {
    const [rows] = await db.execute(
      "SELECT id, name, email, role, profession, address, created_at FROM users WHERE role = 'professional'"
    );
    return rows;
  },
};
