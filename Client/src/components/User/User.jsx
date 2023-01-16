import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { followUser, unFollowUser } from "../../api/FollowRequest";

const User = ({ user }) => {
  const dispatch = useDispatch();
  const serverImages = process.env.REACT_APP_PUBLIC_IMAGES;
  const serverStatic = process.env.REACT_APP_STATIC_FOLDER;
  const myFollowings = useSelector(
    (state) => state.authReducer.authData.user.following
  );
  const handleFollow = async (id) => {
    try {
      const response = await followUser(id);
      dispatch({ type: "FOLLOW_SUCCESS", payload: response.data.id });
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnFollow = async (id) => {
    try {
      const response = await unFollowUser(id);
      dispatch({ type: "UN_FOLLOW_SUCCESS", payload: response.data.id });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="followers">
      <div>
        <img
          src={
            user?.profilePicture
              ? `${serverImages}/${user.profilePicture}`
              : `${serverStatic}/profile.jpg`
          }
          alt=""
          className="followerImg"
        />
        <div className="name">
          <span>
            <Link to={`/profile/${user._id}`}>
              {user.firstName} {user.lastName}
            </Link>
          </span>
          <span>
            <Link to={`/profile/${user._id}`}>@{user.username}</Link>
          </span>
        </div>
      </div>

      {myFollowings.includes(user._id) ? (
        <button
          className="button unfollow-button"
          onClick={() => handleUnFollow(user._id)}
        >
          Unfollow
        </button>
      ) : (
        <button
          className="button fc-button"
          onClick={() => handleFollow(user._id)}
        >
          Follow
        </button>
      )}
    </div>
  );
};

export default User;
