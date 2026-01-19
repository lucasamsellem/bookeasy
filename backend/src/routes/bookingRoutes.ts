import { Router } from 'express';
import { makeBooking } from '../controllers/booking.controller';

export const bookingRouter = Router();

bookingRouter.post('/', makeBooking);
