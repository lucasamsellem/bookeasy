import { Router } from 'express';
import { makeBooking, getBookings } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRoles';

export const bookingRouter = Router();

bookingRouter.get('/', [authMiddleware, authorizeRoles('customer')], getBookings);
bookingRouter.post('/', [authMiddleware, authorizeRoles('customer')], makeBooking);
