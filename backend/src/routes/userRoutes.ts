import { Router } from 'express';
import {
  getUsers,
  createUser,
  deleteUser,
  getUserById,
  updateUserByAdmin,
  createUserFromAdmin,
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/authorizeRoles';

export const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.post('/admin', [authMiddleware, authorizeRoles('superAdmin')], createUserFromAdmin);
userRouter.put('/:id', authMiddleware, updateUserByAdmin);
userRouter.delete('/:id', authMiddleware, deleteUser);
