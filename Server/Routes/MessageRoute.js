import express from "express";
import { addMessage, getMessages } from "../Controllers/MessageController.js";
import authenticate from "../middleware/Auth.js";
const router = express.Router();

router.use(authenticate);
router.post("/", addMessage);
router.get("/:chatId", getMessages);

export default router;
