// Rôle : configuration d’Express, des middlewares globaux et des routes principales.

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { customerRouter } from './routes/customerRoutes';
import { bookingRouter } from './routes/bookingRoutes';
import { availabilitiesRouter } from './routes/availabilitiesRoutes';
import { reviewsRouter } from './routes/reviewsRoutes';
import cookieParser from 'cookie-parser';

// app.use() sert à installer des middlewares dans Express, pour traiter, filtrer ou enrichir les requêtes avant qu’elles n’atteignent tes controllers.
export const app = express();

app.use(express.json());

app.use(cookieParser()); // avant les routes

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

// Toutes les routes définies dans userRouter seront préfixées par /api/users.
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/customers', customerRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/availabilities', availabilitiesRouter);

app.get('/health', (_, res) => {
  res.status(200).json({ status: "let's get healthy!!" });
});
