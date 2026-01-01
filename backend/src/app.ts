// Rôle : configuration d’Express, des middlewares globaux et des routes principales.

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/authRoutes';
import { userRouter } from './routes/userRoutes';
import { customerRouter } from './routes/customerRoutes';

export const app = express();

// app.use() sert à installer des middlewares dans Express, pour traiter, filtrer ou enrichir les requêtes avant qu’elles n’atteignent tes controllers.

app.use(cors());
app.use(express.json());

// Toutes les routes définies dans userRouter seront préfixées par /api/users.
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/customers', customerRouter);

app.get('/health', (_, res) => {
  res.status(200).json({ status: "let's get healthy!!" });
});
