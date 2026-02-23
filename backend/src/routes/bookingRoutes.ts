import { Router } from 'express';
import { makeBooking, getBookings } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

export const bookingRouter = Router();

bookingRouter.get('/', authMiddleware, getBookings);
bookingRouter.post('/', authMiddleware, makeBooking);
