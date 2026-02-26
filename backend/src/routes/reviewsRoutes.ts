import { Router } from 'express';
import { createReview, getReviewsByProfessional } from '../controllers/reviews.controller';

export const reviewsRouter = Router();

reviewsRouter.get('/:id', getReviewsByProfessional);
reviewsRouter.post('/', createReview);
