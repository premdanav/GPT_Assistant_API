import express from "express";
import * as openAiController from "../controllers/openAiController.js";

const router = express.Router();

router.post("/thread", openAiController.createThread);
router.post("/thread/:id/message", openAiController.createMessage);
router.post("/thread/:id/run", openAiController.runThread);
router.put("/thread/:id/assistant", openAiController.createAssistant);
router.get("/thread/:id/history", messageController.getHistory);

export default router;
