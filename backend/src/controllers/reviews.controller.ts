import { Request, Response } from 'express';
import { db } from '../config/db';

// GET /reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const [reviews] = await db.execute('SELECT * FROM reviews ORDER BY createdAt DESC');
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /reviews
export const createReview = async (req: Request, res: Response) => {
  const { bookingId, professionalId, customerId, rating, comment } = req.body;

  if (!bookingId || !professionalId || !customerId || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const [proCheck] = await db.execute('SELECT id FROM users WHERE id = ? AND role = ?', [
      professionalId,
      'professional',
    ]);
    if ((proCheck as any[]).length === 0) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    const [bookingCheck] = await db.execute(
      `SELECT id FROM bookings
       WHERE id = ? AND customerId = ? AND professionalId = ?
       AND ADDTIME(selectedDate, selectedHour) <= NOW()`,
      [bookingId, customerId, professionalId],
    );
    if ((bookingCheck as any[]).length === 0) {
      return res.status(403).json({ message: 'No completed booking found with this professional' });
    }

    const [existingReview] = await db.execute('SELECT id FROM reviews WHERE bookingId = ?', [
      bookingId,
    ]);
    if ((existingReview as any[]).length > 0) {
      return res.status(409).json({ message: 'Review already exists for this booking' });
    }

    const [result] = await db.execute(
      `INSERT INTO reviews (bookingId, professionalId, customerId, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [bookingId, professionalId, customerId, rating, comment || null],
    );

    res.status(201).json({ message: 'Review created', reviewId: (result as any).insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReviewsByProfessional = async (req: Request, res: Response) => {
  const { professionalId } = req.params;

  if (!professionalId) {
    return res.status(400).json({ message: 'Missing professionalId' });
  }

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
