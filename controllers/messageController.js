import * as messageService from "../services/messageService.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getAllMessages();
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await messageService.getMessageById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const message = await messageService.createMessage(userId, content);
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;
    const message = await messageService.updateMessage(id, userId, content);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await messageService.deleteMessage(id);
    if (!message) return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
