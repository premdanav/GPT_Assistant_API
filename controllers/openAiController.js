import * as openAiService from "../services/openAiService.js";

export const createAiChat = async (req, res) => {
  try {
    const { userId, message, content, role } = req?.body;
    if (!userId || !message || !content || !role) {
      return res
        .status(400)
        .json({ error: "userId, message and content are required" });
    }

    const threadId = openAiService.getOrcreateThread(userId);
    if (!threadId) {
      return res.status(400).json({ error: "Failed to create thread" });
    }

    const messageCreated = openAiService.createMessages(
      threadId,
      role,
      content
    );

    if (!messageCreated) {
      return res.status(400).json({ error: "Failed to create message" });
    }

    const assistantId = process.env.ASSISTANT_ID;

    const openAiRes = openAiService?.runThread(threadId, assistantId);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    openAiRes.on("data", (chunk) => {
      console.log("data", chunk.toString());
      res.write(`data: ${chunk.toString()}\n\n`);
    });
    openAiRes.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });
    openAiRes.on("error", (error) => {
      console.error("Error streaming response:", error);
      res.end();
    });
  } catch (err) {
    console.error("Error in createAiChat:", err);
    res.status(500).json({ error: err.message });
  }
};

export const createAssistant = async (req, res) => {
  try {
    const assistantId = await openAiService.getAssistantId();
    res.status(200).json({ assistantId });
  } catch (err) {
    console.error("Error in getAssistantId:", err);
    res.status(500).json({ error: err.message });
  }
};
/**
 * Retrieve the conversation history for a user.
 * Expects: userId as a URL parameter.
 */
export const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const history = await openAiService.getHistory(userId);
    res.status(200).json(history);
  } catch (err) {
    console.error("Error in getHistory:", err);
    res.status(500).json({ error: err.message });
  }
};
