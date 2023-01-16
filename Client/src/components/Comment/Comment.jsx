import moment from "moment";
import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { likeComment } from "../../api/CommentRequest";
const serverImages = process.env.REACT_APP_PUBLIC_IMAGES;

const Comment = ({ comment, onDelete }) => {
  const userId = useSelector((state) => state.authReducer.authData.user._id);
  const [liked, setLiked] = useState(comment.likes.includes(userId));
  const [likeCount, setLikeCount] = useState(comment.likes.length);

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId);
      setLiked((pre) => !pre);
      setLikeCount((oldCount) => {
        if (liked) {
          return oldCount - 1;
        } else {
          return oldCount + 1;
        }
      });
    } catch (err) {
      if (err.response?.data?.expired) {
        return dispatch({ type: "LOGOUT" });
      }
      console.log(err);
    }
  };
  return (
    <div className="comment-body">
      <div className="comment-author">
        <img src={`${serverImages}/${comment.profilePicture}`} alt="" />
      </div>
      <div className="comment-content">
        <Link to={`/profile/${comment.userId}`}>
          <h2>@{comment.username}</h2>
        </Link>
        <span>{moment(comment.createdAt).fromNow()}</span>
        <p>{comment.comment}</p>
        <div className="comment-like">
          <div onClick={() => handleLikeComment(comment._id)}>
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}{" "}
            <span>{likeCount}</span>
          </div>
          {comment.userId === userId && (
            <p onClick={() => onDelete(comment._id)}>Delete</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
