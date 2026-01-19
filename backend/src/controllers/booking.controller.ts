import { db } from '../config/db';
import { Request, Response } from 'express';

export interface Booking {
  customerId: number;
  professionalId: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  description: string;
}

// POST /bookings
export const makeBooking = async (req: Request, res: Response) => {
  const { customerId, professionalId, startTime, endTime, description } = req.body;

  if (!customerId || !professionalId || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Vérifier le professional
    const [proCheck] = await db.execute('SELECT id FROM users WHERE id = ? AND role = ?', [
      professionalId,
      'professional',
    ]);

    if ((proCheck as any[]).length === 0) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    // Vérifier conflit
    const [conflictCheck] = await db.execute(
      `
      SELECT 1 FROM bookings
      WHERE professionalId = ?
        AND ((startTime < ? AND endTime > ?) OR
             (startTime < ? AND endTime > ?) OR
             (startTime >= ? AND endTime <= ?))
      `,
      [professionalId, endTime, endTime, startTime, startTime, startTime, endTime],
    );

    if ((conflictCheck as any[]).length > 0) {
      return res.status(409).json({ message: 'Time slot not available' });
    }

    // Créer réservation
    const [result] = await db.execute(
      `
      INSERT INTO bookings (customerId, professionalId, startTime, endTime, status, createdAt, description)
      VALUES (?, ?, ?, ?, 'pending', NOW(), ?)
      `,
      [customerId, professionalId, startTime, endTime, description || ''],
    );

    res.status(201).json({ message: 'Booking created', bookingId: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
