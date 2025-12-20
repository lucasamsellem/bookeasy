import { User } from '../models/User';

export const getAllUsers = async () => {
  return User.find();
};

export const createUser = async (data: any) => {
  const user = new User(data);
  return user.save();
};
