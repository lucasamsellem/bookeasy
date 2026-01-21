import { db } from '../config/db';
import { Request, Response } from 'express';
import { BOOKING_COLUMNS } from '../utils/columns';

export interface Booking {
  id: number;
  customerId: number;
  professionalId: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  description: string;
}

// GET /bookings
export const getBookings = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(`SELECT ${BOOKING_COLUMNS} FROM bookings`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /bookings
export const makeBooking = async (req: Request, res: Response) => {
  const { customerId, professionalId, selectedDate, selectedHour, description } = req.body;

  if (!customerId || !professionalId || !selectedDate || !selectedHour) {
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

    // Vérifier conflit exact (même date + même heure)
    const [conflictCheck] = await db.execute(
      `
      SELECT 1 FROM bookings
      WHERE professionalId = ?
        AND selectedDate = ?
        AND selectedHour = ?
      `,
      [professionalId, selectedDate, selectedHour],
    );

    if ((conflictCheck as any[]).length > 0) {
      return res.status(409).json({ message: 'Time slot not available' });
    }

    // Créer réservation
    const [result] = await db.execute(
      `
      INSERT INTO bookings (
        customerId,
        professionalId,
        selectedDate,
        selectedHour,
        status,
        description,
        createdAt
      )
      VALUES (?, ?, ?, ?, 'pending', ?, NOW())
      `,
      [customerId, professionalId, selectedDate, selectedHour, description || ''],
    );

    res.status(201).json({
      message: 'Booking created',
      bookingId: (result as any).insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
