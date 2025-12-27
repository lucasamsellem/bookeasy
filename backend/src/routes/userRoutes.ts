import { Router } from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.delete('/:id', deleteUser);
