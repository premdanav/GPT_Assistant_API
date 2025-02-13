// services/openAiService.js
import axios from "axios";

import dotenv from "dotenv";
import { User } from "../models/index.js";
import { openAi } from "../utils/config.js";

dotenv.config();

// Create a PostgreSQL connection pool using DATABASE_URL

/**
 * Helper function to get a stored thread ID for a given user.
 */
const getThreadForUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });

  if (user) {
    return user?.dataValues?.threadId;
  }
  return null;
};

/**
 * Helper function to store a thread ID for a given user.
 */
const saveThreadForUser = async (userId, threadId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (user) {
    await user.update({ threadId });
  }
};

/**
 * 1) Create a new thread for a user using OpenAI's create thread endpoint.
 *    - If a thread already exists for the user, return that thread ID.
 */
export const getOrcreateThread = async (userId) => {
  let threadId = await getThreadForUser(userId);
  if (threadId) {
    return { threadId };
  }

  const threadObj = openAi?.beta?.threads?.create();

  threadId = threadObj?.id;

  if (!threadId) {
    return null;
  }

  await saveThreadForUser(userId, threadId);

  return { threadId };
};

/**
 * 2) Create a user message using OpenAI's create message endpoint.
 *    - If the user does not yet have a thread, create one first.
 */
export const createMessages = async (threadId, role, content) => {
  const threadMessages = await openAi?.beta?.threads?.messages?.create(
    threadId,
    {
      role,
      content,
    }
  );
  if (!threadMessages) {
    return false;
  }
  return true;
};

/**
 * 3) Run the thread by calling OpenAI's run thread endpoint using the user's thread ID.
 *    - Returns a streaming response.
 */
export const runThread = async (threadId, assistantId) => {
  const run = await openAi.beta.threads.runs.create(threadId, {
    assistantId,
    stream: true,
    temperature: 0,
  });
  return run;
};

/**
 * 4) Retrieve conversation history by calling OpenAI's get history endpoint.
 */
export const getHistory = async (userId) => {
  const threadId = await getThreadForUser(userId);
  if (!threadId) {
    throw new Error("Thread not found for the user");
  }
  // Construct the URL (e.g., https://api.openai.com/v1/threads/{threadId}/messages)
  const url = `${process.env.OPENAI_GET_HISTORY_URL}/${threadId}/messages`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getAssistantId = async () => {
  try {
    const macroTracker = await openAi.beta.assistants.create({
      instructions: `
    You are a knowledgeable and certified nutritionist
    Your role is to provide accurate, evidence-based information on nutrition, dietary advice,
    and food-related inquiries only. You should focus on topics such as macro- and micronutrients,
    healthy eating habits, food composition, diet plans, and nutritional research. If a question is asked
    that falls outside the scope of nutrition and food, politely indicate that your expertise is
    limited to nutrition. Ensure that all recommendations are cautious, backed by scientific evidence,
    and avoid making specific medical diagnoses or prescribing personalized treatments without a professional
    consultation.
  `,
      name: "Macro Tracker",
      model: "gpt-3.5-turbo",
    });

    return macroTracker?.id;
  } catch (error) {
    console.log(`Error while creating assistant`, error?.messages);
    return null;
  }
};
