import { Router } from 'express';
import { makeBooking, getBookings } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { customerMiddleware } from '../middlewares/customerMiddleware';

export const bookingRouter = Router();

bookingRouter.get('/', [authMiddleware, customerMiddleware], getBookings);
bookingRouter.post('/', [authMiddleware, customerMiddleware], makeBooking);
