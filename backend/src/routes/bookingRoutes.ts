import { Router } from 'express';
import {
  makeBooking,
  getBookings,
  getUserBookings,
  updateBookingStatus,
} from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRoles';

export const bookingRouter = Router();

bookingRouter.get('/', [authMiddleware, authorizeRoles('customer')], getBookings);

bookingRouter.get(
  '/user/:id',
  [authMiddleware, authorizeRoles('customer', 'professional')],
  getUserBookings,
);

bookingRouter.post('/', [authMiddleware, authorizeRoles('customer')], makeBooking);
bookingRouter.patch('/:id/status', updateBookingStatus);
