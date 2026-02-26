import { Request, Response } from 'express';
import { db } from '../config/db';

// POST /availabilities
export const createAvailability = async (req: Request, res: Response) => {
  const { professionalId, dayOfWeek, startHour, endHour } = req.body;

  if (!professionalId || dayOfWeek === undefined || !startHour || !endHour) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Vérifier que c'est bien un professionnel
    const [proCheck] = await db.execute('SELECT id FROM users WHERE id = ? AND role = ?', [
      professionalId,
      'professional',
    ]);
    if ((proCheck as any[]).length === 0) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    // Ajouter le créneau
    const [result] = await db.execute(
      `
      INSERT INTO availabilities (professionalId, dayOfWeek, startHour, endHour, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, NOW(), NOW())
      `,
      [professionalId, dayOfWeek, startHour, endHour],
    );

    res
      .status(201)
      .json({ message: 'Availability created', availabilityId: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /availabilities
export const getAvailabilitiesByProfessional = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [availabilities] = await db.execute(
      'SELECT * FROM availabilities WHERE professionalId = ? ORDER BY dayOfWeek, startHour',
      [id],
    );

    res.status(200).json(availabilities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
