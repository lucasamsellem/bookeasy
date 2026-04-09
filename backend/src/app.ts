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
import { db } from './config/db';

// app.use() sert à installer des middlewares dans Express, pour traiter, filtrer ou enrichir les requêtes avant qu’elles n’atteignent tes controllers.
export const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://bookeasy-alpha.vercel.app'],
  credentials: true,
};

app.use(cors(corsOptions));
// IMPORTANT : preflight avec les mêmes options
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser()); // avant les routes

// Toutes les routes définies dans userRouter seront préfixées par /api/users.
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/customers', customerRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/availabilities', availabilitiesRouter);

app.get('/api/health', (_, res) => {
  res.status(200).json({ status: "let's get healthy!!" });
});

app.get('/test-db', async (req, res) => {
  const [rows] = await db.query('SELECT 1');
  res.json(rows);
});
