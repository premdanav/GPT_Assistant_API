import { User } from "../models/index.js";

export const getAllUsers = async () => {
  return await User.findAll();
};

export const getUserById = async (id) => {
  return await User.findByPk(id);
};

export const createUser = async (name, email) => {
  return await User.create({ name, email });
};

export const updateUser = async (id, name, email) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.name = name;
  user.email = email;
  await user.save();
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return user;
};
