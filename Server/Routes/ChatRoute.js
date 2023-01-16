import express from "express";
import {
  createChat,
  findChat,
  userChat,
} from "../Controllers/ChatController.js";
import authenticate from "../middleware/Auth.js";
const router = express.Router();

router.use(authenticate);
router.get("/", userChat);
router.post("/:memberId", createChat);
router.get("/find/:receiverId", findChat);

export default router;
