import React, { useState } from "react";
import "./Post.css";
import Like from "../../img/like.png";
import NotLike from "../../img/notlike.png";
//import Share from "../../img/share.png";
import Comment from "../../img/comment.png";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Actions from "../Actions/Actions";
import useComponentVisible from "../../hooks/useComponentVisible";
import Comments from "../Comments/Comments";
import { editPost, likePost } from "../../api/PostRequest";
import ReportModal from "../ReportModal/ReportModal";
import { UilEdit, UilTimes, UilEllipsisH } from "@iconscout/react-unicons";


import { useRef } from "react";
import { useEffect } from "react";
const serverStatic = process.env.REACT_APP_STATIC_FOLDER;
const serverImages = process.env.REACT_APP_PUBLIC_IMAGES;
const serverVideos = process.env.REACT_APP_PUBLIC_VIDEOS;

const Post = React.forwardRef(({ data }, ref) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likeCount, setLikeCount] = useState(data.likes.length);
  const [caption, setCaption] = useState(data.description);
  const [showComments, setShowComments] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { dropdownRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  const editRef = useRef();
  const handlePostLike = async (id) => {
    try {
      await likePost(id);
      setLiked((preValue) => !preValue);
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

  const handleSubmitEdit = async () => {
    const newCaption = editRef.current.value;
    const postId = data._id;
    if (newCaption.trim().length === 0) return;
    try {
      await editPost(postId, newCaption);
      setCaption(newCaption);
    } catch (err) {
      console.log(err);
    }
    setShowEdit(false);
  };

  useEffect(() => {
    if (showEdit) {
      editRef.current.focus();
    }
  }, [showEdit]);

  return (
    <div ref={ref} className="post">
      {openModal && (
        <ReportModal
          postId={data._id}
          openReportModal={openModal}
          closeReportModal={() => setOpenModal(false)}
        />
      )}
      <div className="postAuthor">
        <img
          src={
            data.profilePicture
              ? `${serverImages}/${data.profilePicture}`
              : `${serverStatic}/profile.jpg`
          }
          alt=""
        />
        <span>
          <Link to={`/profile/${data.userId}`}>
            {data.firstName} {data.lastName}
          </Link>
        </span>
        <div className="more-options">
          <div onClick={() => setIsComponentVisible(true)}>
            <UilEllipsisH />
          </div>
          {isComponentVisible && (
            <Actions
              ref={dropdownRef}
              userId={data?.userId}
              postId={data?._id}
              openReportModal={() => setOpenModal((pre) => !pre)}
              onEdit={() => setShowEdit(true)}
            />
          )}
        </div>
      </div>
      {data.image && <img src={`${serverImages}/${data.image}`} alt="" />}
      {data.video && (
        <video loop autoPlay={true} muted>
          <source src={`${serverVideos}/${data.video}`} type="video/mp4" />
        </video>
      )}
      {/*  */}
      <div className="postReact">
        <img
          onClick={() => handlePostLike(data._id)}
          src={liked ? Like : NotLike}
          alt=""
        />
        <img
          src={Comment}
          alt=""
          onClick={() => setShowComments((pre) => !pre)}
        />
        {/* <img src={Share} alt="" /> */}
      </div>
      <span style={{ color: "var(--grey)", fontSize: "14px" }}>
        {likeCount} Likes
      </span>
      <div className="detail">
        {!showEdit && <span>{caption}</span>}
        {showEdit && (
          <div>
            <input defaultValue={caption} type="text" ref={editRef} />
            <div className="edit-caption" onClick={handleSubmitEdit}>
              <UilEdit />
            </div>
            <div onClick={() => setShowEdit(false)}>
              <UilTimes />
            </div>
          </div>
        )}
      </div>
      {showComments && (
        <div>
          <Comments postId={data._id} />
        </div>
      )}
    </div>
  );
});

export default Post;
