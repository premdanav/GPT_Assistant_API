import express from "express";
import * as messageController from "../controllers/messageController.js";

const router = express.Router();

router.get("/", messageController.getMessages);
router.get("/:id", messageController.getMessage);
router.post("/", messageController.createMessage);
router.put("/:id", messageController.updateMessage);
router.delete("/:id", messageController.deleteMessage);

export default router;
