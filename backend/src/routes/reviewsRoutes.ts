import { Router } from 'express';
import { createReview, getReviewsByProfessional } from '../controllers/reviews.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRoles';

export const reviewsRouter = Router();

reviewsRouter.get('/:id', getReviewsByProfessional);
reviewsRouter.post('/', authMiddleware, authorizeRoles('customer'), createReview);
