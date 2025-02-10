import * as openAiService from "../services/openAiService.js";

export const createThread = async (req, res) => {
  try {
    const thread = await openAiService.createThread();
    res.status(201).json(thread);
  } catch (err) {
    console.error("Error in createThread:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { id: threadId } = req.params;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }
    const conversation = await openAiService.createMessage(threadId, message);
    res.status(201).json(conversation);
  } catch (err) {
    console.error("Error in createMessage:", err);
    res.status(500).json({ error: err.message });
  }
};

export const runThread = async (req, res) => {
  try {
    const { id: threadId } = req.params;
    const assistantResponse = await openAiService.runThread(threadId);
    res.status(200).json(assistantResponse);
  } catch (err) {
    console.error("Error in runThread:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createAssistant = async (req, res) => {
  try {
    const { id: threadId } = req.params;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Assistant message is required" });
    }
    const assistantMsg = await openAiService.createAssistant(threadId, message);
    res.status(200).json(assistantMsg);
  } catch (err) {
    console.error("Error in createAssistant:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { id: threadId } = req.params;
    const history = await openAiService.getHistory(threadId);
    res.status(200).json(history);
  } catch (err) {
    console.error("Error in getHistory:", err);
    res.status(500).json({ error: err.message });
  }
};
