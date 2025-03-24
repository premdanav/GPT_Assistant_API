import express from "express";
import * as openAiController from "../controllers/openAiController.js";

const router = express.Router();

router.post("/run", openAiController.createAiChat);
router.put("/assistant", openAiController.createAssistant);

export default router;
