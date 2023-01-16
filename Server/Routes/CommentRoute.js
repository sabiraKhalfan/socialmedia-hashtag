import express from "express";
import authenticate from "../middleware/Auth.js";
import {
  deleteComment,
  getComments,
  likeComment,
  postComment,
} from "../Controllers/CommentController.js";
const router = express.Router();

router.use(authenticate);

router.get("/:id", getComments);
router.post("/:id", postComment);
router.put("/:id", likeComment);
router.delete("/:id", deleteComment);

export default router;
