import express from "express";
import {
  deleteUser,
  followUser,
  getUser,
  unFollowUser,
  updateUser,
  getFollowers,
  getAllUsers,
  getNotifications,
  clearNotifications,
  searchUser,
} from "../Controllers/UserController.js";
import authenticate from "../middleware/Auth.js";
const router = express.Router();

router.use(authenticate);
router.get("/", getAllUsers);
router.get("/search", searchUser);
router.get("/notifications", getNotifications);
router.get("/:id", getUser);
router.get("/followers/:id", getFollowers);

router.put("/:id", updateUser);
router.put("/:id/clearNotifications/", clearNotifications);
router.put("/:id/follow", followUser);
router.put("/:id/unFollow", unFollowUser);

router.delete("/:id", deleteUser);

export default router;
