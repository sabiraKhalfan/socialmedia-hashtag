import User from "../Models/userModal.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Post from "../Models/postModal.js";
import { v4 as uuidv4 } from "uuid";

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id)
      .select({
        password: 0,
        isAdmin: 0,
        createdAt: 0,
        updatedAt: 0,
        isVerified: 0,
        notifications: 0,
      })
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const totalPosts = await Post.find({ userId: user._id }).countDocuments();
    user.totalPosts = totalPosts;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json("something went wrong");
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } }).select({
      password: 0,
      isAdmin: 0,
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json("something went wrong");
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const { password } = req.body;
    if (id === req.user.userId) {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      // new:true will return updated user status
      user.password = undefined;
      res.status(200).json({ user });
    } else {
      res.status(403).json({ message: "You are not authorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const currentUserId = req.user.userId;
  const { currentUserAdminStatus } = req.user.isAdmin;
  try {
    if (id === currentUserId || currentUserAdminStatus) {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(403).json({ message: "You are not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getFollowers = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(401).json({ message: "please provide id" });
  }
  try {
    const followers = await User.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "myFollowers",
        },
      },
      {
        $project: {
          "myFollowers.password": false,
          "myFollowers.isAdmin": false,
          "myFollowers.followers": false,
          "myFollowers.following": false,
          _id: 0,
        },
      },
    ]);
    const myFollowers = followers[0].myFollowers;
    res.status(200).json({ followers: myFollowers });
  } catch (error) {
    res.status(500).json({ message: "something went wrong", error });
  }
};

export const followUser = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.user;
  if (userId === id) {
    return res.status(403).json("Action forbidden");
  }
  try {
    const followUser = await User.findById(id);
    const followingUser = await User.findById(userId);
    if (!followUser || !followingUser) {
      return res.status(404).json({ message: "user not found" });
    }
    if (!followUser.followers.includes(userId)) {
      const notification = {
        id: uuidv4(),
        title: "New Follower",
        profilePicture: followingUser.profilePicture,
        message: `${followingUser.firstName} ${followingUser.lastName} started following you.`,
        link: `/profile/${followingUser._id}`,
        time: Date.now(),
      };
      await followUser.updateOne({
        $push: {
          followers: mongoose.Types.ObjectId(userId),
        },
      });
      followUser.notifications.unshift(notification);
      await followUser.save();
      await followingUser.updateOne({
        $push: { following: mongoose.Types.ObjectId(id) },
      });
      res
        .status(201)
        .json({ message: "User followed successfully", id: followUser.id });
    } else {
      res.status(403).json({ message: "User is already followed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong", error });
  }
};

export const unFollowUser = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.user;
  if (id === userId) {
    return res.status(403).json({ message: "Action forbidden" });
  }
  try {
    const followUser = await User.findById(id);
    const followingUser = await User.findById(userId);
    if (!followUser || !followingUser) {
      return res.status(404).json({ message: "user not found" });
    }
    if (followUser.followers.includes(userId)) {
      await followUser.updateOne({
        $pull: { followers: mongoose.Types.ObjectId(userId) },
      });
      await followingUser.updateOne({
        $pull: { following: mongoose.Types.ObjectId(id) },
      });
      res
        .status(201)
        .json({ message: "User unFollowed successfully", id: followUser.id });
    } else {
      res.status(403).json({ message: "user is not followed by you" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getNotifications = async (req, res) => {
  const { userId } = req.user;
  try {
    const notifications = await User.findById(userId).select({
      notifications: 1,
      _id: 0,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json("something went wrong");
  }
};

export const clearNotifications = async (req, res) => {
  const { userId } = req.user;
  try {
    await User.findByIdAndUpdate(userId, {
      notifications: [],
    });
    res.status(200).json({ message: "notification cleared successfully" });
  } catch (error) {
    res.status(500).json("something went wrong");
  }
};

export const searchUser = async (req, res) => {
  try {
    const keyword = req.query.name || "";
    const users = await User.find({
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
      ],
    }).select({ username: 1, firstName: 1, lastName: 1, profilePicture: 1 });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};
