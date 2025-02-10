import axios from "axios";

const threads = new Map();

/**
 * Creates a new conversation thread.
 * Returns an object with a new thread ID and an empty messages array.
 */
export const createThread = async () => {
  const threadId = Date.now().toString();
  threads.set(threadId, []); // initialize an empty conversation
  return { threadId, messages: [] };
};

/**
 * Adds a user message to an existing thread.
 */
export const createMessage = async (threadId, message) => {
  if (!threads.has(threadId)) {
    throw new Error("Thread not found");
  }
  const conversation = threads.get(threadId);
  const userMessage = { role: "user", content: message };
  conversation.push(userMessage);
  return conversation;
};

/**
 * Runs the thread by sending the conversation history to ChatGPT
 * and then appending the assistant's reply.
 */
export const runThread = async (threadId) => {
  if (!threads.has(threadId)) {
    throw new Error("Thread not found");
  }
  const conversation = threads.get(threadId);

  // Prepare the payload for the ChatGPT API
  const apiUrl = process.env.CHATGPT_API_URL;
  const apiKey = process.env.CHATGPT_API_KEY;
  const payload = {
    model: "gpt-3.5-turbo", // adjust as needed
    messages: conversation,
  };

  // Make the API call
  const response = await axios.post(apiUrl, payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  // Assume the API response structure is like:
  // { choices: [ { message: { role: "assistant", content: "..." } } ] }
  const assistantMessage = response.data.choices[0].message;
  conversation.push(assistantMessage);
  return assistantMessage;
};

/**
 * Manually adds an assistant’s message to the thread.
 */
export const createAssistant = async (threadId, message) => {
  if (!threads.has(threadId)) {
    throw new Error("Thread not found");
  }
  const conversation = threads.get(threadId);
  const assistantMsg = { role: "assistant", content: message };
  conversation.push(assistantMsg);
  return assistantMsg;
};

/**
 * Retrieves the conversation history for a thread.
 */
export const getHistory = async (threadId) => {
  if (!threads.has(threadId)) {
    throw new Error("Thread not found");
  }
  return threads.get(threadId);
};
