import { Router } from 'express';
import { makeBooking, getBookings } from '../controllers/booking.controller';

export const bookingRouter = Router();

bookingRouter.get('/', getBookings);
bookingRouter.post('/', makeBooking);
