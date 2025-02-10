// services/messageService.js
import { Message } from "../models/index.js";

export const getAllMessages = async () => {
  return await Message.findAll();
};

export const getMessageById = async (id) => {
  return await Message.findByPk(id);
};

export const createMessage = async (userId, content) => {
  return await Message.create({ userId, content });
};

export const updateMessage = async (id, userId, content) => {
  const message = await Message.findByPk(id);
  if (!message) return null;
  message.userId = userId;
  message.content = content;
  await message.save();
  return message;
};

export const deleteMessage = async (id) => {
  const message = await Message.findByPk(id);
  if (!message) return null;
  await message.destroy();
  return message;
};
