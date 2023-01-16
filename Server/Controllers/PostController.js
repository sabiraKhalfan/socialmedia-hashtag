import mongoose from "mongoose";
import Post from "../Models/postModal.js";
import User from "../Models/userModal.js";
import Report from "../Models/reportModal.js";
import { v4 as uuidv4 } from "uuid";

export const createNewPost = async (req, res) => {
  req.body.userId = req.user.userId;
  try {
    const post = new Post(req.body);
    await post.save();
    await User.populate(post, {
      path: "userId",
      select: { username: 1, firstName: 1, lastName: 1, profilePicture: 1 },
    });
    const newPost = {
      ...post._doc,
      userId: post.userId._id,
      username: post.userId.username,
      firstName: post.userId.firstName,
      lastName: post.userId.lastName,
      profilePicture: post.userId.profilePicture,
    };
    let message = "New post created successfully";
    if (newPost.scheduledDate) message = "Post scheduled successful";
    res.status(201).json({ message, newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(401).json({ message: "Id is required" });
  }
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.user;
  const { description } = req.body;
  if (!(id && userId)) {
    res.status(401).json({ message: "all filed are required" });
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "your not authorized" });
    }
    await post.updateOne({ description });
    res.status(201).json({ message: "Post updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.user;
  if (!id) {
    res.status(401).json({ message: "Plead provide post Id" });
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        message: "your not authorized, you cant delete someone else post.",
      });
    }
    await post.deleteOne();
    res
      .status(201)
      .json({ message: "post deleted successfully", id: post._id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.user;
  if (!id) {
    return res.status(401).json({ message: "post id is required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "your not authorized" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });

      //check whether the post is belongs to same user
      if (post.userId.toString() !== userId) {
        const notification = {
          id: uuidv4(),
          title: "Like",
          profilePicture: user.profilePicture,
          message: `${user.firstName} ${user.lastName} liked your post`,
          time: Date.now(),
          link: `/profile/${user._id}`,
        };
        const postAuthor = await User.findById(post.userId);
        postAuthor.notifications.unshift(notification);
        await postAuthor.save();
      }

      res.status(201).json({ message: "Post liked successfully" });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(201).json({ message: "Post unlike successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserPosts = async (req, res) => {
  const userId = req.params.id;
  const LIMIT = 3;
  const skip = Number(req?.query?.skip) || 0;
  if (!userId) {
    return res.status(401).json({ message: "please provide userId" });
  }
  try {
    const posts = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          username: 1,
          firstName: 1,
          lastName: 1,
          profilePicture: 1,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "posts",
        },
      },
      {
        $unwind: {
          path: "$posts",
        },
      },
      {
        $match: {
          $or: [
            {
              "posts.scheduledDate": {
                $exists: false,
              },
            },
            {
              "posts.scheduledDate": {
                $lt: new Date(),
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$$ROOT", "$posts"],
          },
        },
      },
      {
        $project: {
          posts: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: LIMIT,
      },
    ]);

    res.status(200).json({ message: "Posts fetched successfully", posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getTimelinePost = async (req, res) => {
  const userId = req.params.id;
  const LIMIT = 3;
  const skip = Number(req.query.skip) || 0;
  try {
    const timelinePosts = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "timeline",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "userId",
          as: "myPosts",
        },
      },
      {
        $project: {
          _id: 0,
          allPosts: {
            $concatArrays: ["$timeline", "$myPosts"],
          },
        },
      },
      {
        $unwind: {
          path: "$allPosts",
        },
      },

      //matching posts that are not scheduled or whose scheduled time has passed,
      {
        $match: {
          $or: [
            {
              "allPosts.scheduledDate": {
                $exists: false,
              },
            },
            {
              "allPosts.scheduledDate": {
                $lt: new Date(),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "allPosts.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $project: {
          allPosts: 1,
          "user.username": 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.profilePicture": 1,
        },
      },
      {
        $lookup: {
          from: "reports",
          localField: "allPosts._id",
          foreignField: "postId",
          as: "reports",
        },
      },
      {
        $project: {
          allPosts: 1,
          user: 1,
          reports: {
            $size: "$reports",
          },
        },
      },
      {
        $match: {
          reports: {
            $lt: 5,
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$allPosts", "$user"],
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: LIMIT,
      },
    ]);

    res.status(200).json({ posts: timelinePosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const reportPost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.user;
  const { type, message } = req.body;
  if (!postId) {
    return res.status(401).json({ message: "please provide postId" });
  }
  const isReported = await Report.findOne({ userId, postId });
  if (isReported) {
    return res
      .status(401)
      .json({ message: "You have already reported this post" });
  }
  try {
    const newReport = new Report({
      postId,
      reporter: userId,
      type,
      message,
    });
    await newReport.save();
    res.status(201).json({ message: "post reported successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
