import "./Comments.css";
import React from "react";
import { UilCommentAdd } from "@iconscout/react-unicons";
import useFetchComments from "../../hooks/useFetchComments";
import { useState } from "react";
import { FadeLoader } from "react-spinners";
import Comment from "../Comment/Comment";
import {
  deleteComment,
  postComment,
} from "../../api/CommentRequest";

const override = {
  display: "block",
  margin: "0 auto",
};

const Comments = ({ postId }) => {
  const [newComment, setNewComment] = useState("");
  const { comments, setComments, loading, setLoading } =
    useFetchComments(postId);

  const handleNewComment = async () => {
    if (newComment.trim().length === 0) return;
    setLoading(true);
    try {
      const response = await postComment(postId, newComment);
      setComments([response.data.comment, ...comments]);
    } catch (err) {
      console.log(err);
    }
    setNewComment("");
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    try {
      await deleteComment(commentId);
      setComments([...comments.filter((comment) => comment._id !== commentId)]);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="comments">
      <p>Comments {comments.length > 0 ? `(${comments.length})` : ""}</p>
      <FadeLoader color="orange" cssOverride={override} loading={loading} />

      {comments &&
        comments.map((comment) => {
          return (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
            />
          );
        })}

      <div className="comment-box">
        <input
          type="text"
          value={newComment}
          placeholder="write your comment"
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div onClick={handleNewComment}>
          <UilCommentAdd />
        </div>
      </div>
    </div>
  );
};

export default Comments;
