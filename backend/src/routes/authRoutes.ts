import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
