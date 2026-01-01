import { Router } from 'express';
import { getProfessionalsController } from '../controllers/customer.controller';

export const customerRouter = Router();

customerRouter.get('/professionals', getProfessionalsController);
