import { Router } from 'express';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewsByProfessional,
} from '../controllers/reviews.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRoles';

export const reviewsRouter = Router();

reviewsRouter.get('/', getAllReviews);
reviewsRouter.get('/:professionalId', getReviewsByProfessional);
reviewsRouter.post('/', authMiddleware, authorizeRoles('customer'), createReview);
reviewsRouter.delete('/:id', deleteReview);
