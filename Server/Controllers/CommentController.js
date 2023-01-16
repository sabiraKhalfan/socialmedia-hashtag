import Comment from "../Models/commentModal.js";
import { v4 as uuidv4 } from "uuid";
import User from "../Models/userModal.js";
import Post from "../Models/postModal.js";
import mongoose from "mongoose";

export const getComments = async (req, res) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(401).json({ message: "post id is required" });
  }
  try {
    const comments = await Comment.aggregate([
      {
        $match: {
          postId: mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          postId: 1,
          comment: 1,
          likes: 1,
          createdAt: 1,
          "author.username": 1,
          "author.profilePicture": 1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$$ROOT", "$author"],
          },
        },
      },
      {
        $project: {
          author: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const postComment = async (req, res) => {
  const { userId } = req.user;
  const postId = req.params.id;
  const { comment } = req.body;
  try {
    const commentAuthor = await User.findById(userId);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "no post found to comment" });
    }
    const myComment = new Comment({
      userId,
      postId,
      comment,
    });
    await myComment.save();
    await User.populate(myComment, {
      path: "userId",
      select: { username: 1, profilePicture: 1 },
    });

    //converting newComment to in aggregated formate to use in frontend
    const newComment = {
      ...myComment._doc,
      userId: myComment.userId._id,
      username: myComment.userId.username,
      profilePicture: myComment.userId.profilePicture,
    };
    if (post.userId.toString() !== userId) {
      const notification = {
        id: uuidv4(),
        title: "Comment",
        profilePicture: commentAuthor.profilePicture,
        message: `${commentAuthor.firstName} ${commentAuthor.lastName} commented on your post`,
        time: Date.now(),
        link: `/profile/${commentAuthor._id}`,
      };
      const postAuthor = await User.findById(post.userId);
      postAuthor.notifications.unshift(notification);
      await postAuthor.save();
    }
    res
      .status(201)
      .json({ message: "new comment added successfully", comment: newComment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const deleteComment = async (req, res) => {
  const { userId } = req.user;
  const commentId = req.params.id;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    if (comment.userId.toString() !== userId) {
      return res.status(401).json({ message: "your not authorized" });
    }
    await comment.deleteOne();
    res.status(201).json({ message: "comment deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

export const likeComment = async (req, res) => {
  const { userId } = req.user;
  const commentId = req.params.id;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    if (comment.likes.includes(userId)) {
      await comment.updateOne({ $pull: { likes: userId } });
      res.status(201).json({ message: "Comment unlike successfully" });
    } else {
      await comment.updateOne({ $push: { likes: userId } });
      if (!userId == comment.userId) {
        const user = await User.findById(userId);
        const commentAuthor = await User.findById(comment.userId);
        const notification = {
          id: uuidv4(),
          title: "Comment reaction",
          profilePicture: user.profilePicture,
          message: `${user.firstName} ${user.lastName} liked your comment`,
          time: Date.now(),
          link: `/profile/${user._id}`,
        };
        commentAuthor.notifications.unshift(notification);
        await commentAuthor.save();
      }
      res.status(201).json({ message: "Comment liked successful" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};
