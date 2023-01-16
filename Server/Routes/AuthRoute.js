import express from "express";
import {
  loginUser,
  registerUser,
  resendVerification,
  verifyAccount,
} from "../Controllers/AuthController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/resendVerification/:id", resendVerification);
router.put("/verify", verifyAccount);
export default router;
