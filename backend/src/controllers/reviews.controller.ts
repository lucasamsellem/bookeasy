import { Request, Response } from 'express';
import { db } from '../config/db';

// POST /reviews
export const createReview = async (req: Request, res: Response) => {
  const { professionalId, customerId, rating, comment } = req.body;

  if (!professionalId || !customerId || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Vérifier le professionnel
    const [proCheck] = await db.execute('SELECT id FROM users WHERE id = ? AND role = ?', [
      professionalId,
      'professional',
    ]);
    if ((proCheck as any[]).length === 0) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    // Ajouter le review
    const [result] = await db.execute(
      `
      INSERT INTO reviews (professionalId, customerId, rating, comment, createdAt)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [professionalId, customerId, rating, comment || null],
    );

    res.status(201).json({ message: 'Review created', reviewId: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReviewsByProfessional = async (req: Request, res: Response) => {
  const { professionalId } = req.params;

  try {
    const [reviews] = await db.execute(
      'SELECT * FROM reviews WHERE professionalId = ? ORDER BY createdAt DESC',
      [professionalId],
    );

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
