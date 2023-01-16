import React, { useEffect, useRef } from "react";
import "./ProfileCard.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserDetails, updateProfile } from "../../actions/UserAction";
import { UilPen, UilEnvelopeAdd } from "@iconscout/react-unicons";
import { uploadImage } from "../../api/UploadRequest";
import { followUser, unFollowUser } from "../../api/FollowRequest";
import { createRoom } from "../../api/ChatRequest";
const serverImages = process.env.REACT_APP_PUBLIC_IMAGES;
const serverStatic = process.env.REACT_APP_STATIC_FOLDER;

const ProfileCard = ({ location }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const { userDetails } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const coverRef = useRef();
  const profileRef = useRef();

  let isUser = false;
  if (!params.id || params.id === user._id) {
    isUser = true;
  }
  useEffect(() => {
    console.log("profile card");
    if (params.id && params.id !== user._id) {
      const userId = params.id;
      dispatch(getUserDetails(userId));
    }
  }, [dispatch, params.id, user._id]);
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      const name = e.target.name;
      const data = new FormData();
      const fileName = Date.now() + img.name;
      data.append("name", fileName);
      data.append("file", img);
      const userDetails = {
        [name]: fileName,
      };
      try {
        await uploadImage(data);
        dispatch(updateProfile(user._id, userDetails));
      } catch (err) {
        console.log(err);
      }
    }
  };

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

  //creating new chatroom with the user
  const handleNewChatRoom = async () => {
    try {
      const memberId = userDetails._id;
      const { data } = await createRoom(memberId);
      console.log(data);
      navigate("/chat");
    } catch (err) {
      console.log(err);
    }
  };

  return (
   <>

    <div className="profileCard">
       
      {(params.id === user._id || location === "home") && (
        <div className="editPen" onClick={() => coverRef.current.click()}>
          <UilPen />
        </div>
      )}
      <div className="profileImages">
        {isUser && (
          <img
            src={
              user?.coverPicture
                ? `${serverImages}/${user.coverPicture}`
                : `${serverStatic}/cover.jpg`
            }
            alt=""
          />
        )}
        {!isUser && (
          <img
            src={
              userDetails?.coverPicture
                ? `${serverImages}/${userDetails.coverPicture}`
                : `${serverStatic}/cover.jpg`
            }
            alt=""
          />
        )}
        {isUser && (
          <img
            src={
              user?.profilePicture
                ? `${serverImages}/${user.profilePicture}`
                : `${serverStatic}/profile.jpg`
            }
            alt=""
            onClick={() => profileRef.current.click()}
          />
        )}
        {!isUser && (
          <img
            src={
              userDetails?.profilePicture
                ? `${serverImages}/${userDetails.profilePicture}`
                : `${serverStatic}/profile.jpg`
            }
            alt=""
          />
        )}
      </div>
      <div className="profileName">
        <span>
          {isUser ? user.firstName : userDetails?.firstName}{" "}
          {isUser ? user.lastName : userDetails?.lastName}
        </span>
        <span>{isUser ? user.about : userDetails?.about}</span>
        <div>
          {!isUser && user.following.includes(userDetails?._id) && (
            <div className="profile-buttons">
              <button
                className="button unfollow-button"
                onClick={() => handleUnFollow(userDetails?._id)}
              >
                Unfollow
              </button>
              <button
                className="button chat-button"
                onClick={handleNewChatRoom}
              >
                <UilEnvelopeAdd />
                Message
              </button>
            </div>
          )}
          {!isUser && !user.following.includes(userDetails?._id) && (
            <button
              className="button fc-button"
              onClick={() => handleFollow(userDetails?._id)}
            >
              follow
            </button>
          )}
        </div>
      </div>
      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>
              {isUser
                ? user?.following?.length
                : userDetails?.following?.length}
            </span>
            <span>Following</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>
              {isUser
                ? user?.followers?.length
                : userDetails?.followers?.length}
            </span>
            <span>Followers</span>
          </div>

          {location === "profile" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                {isUser && <span>{user?.totalPosts || 0}</span>}
                {!isUser && <span>{userDetails?.totalPosts || 0}</span>}
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
      </div>
      {isUser && (
        <div style={{ display: "none" }}>
          <input
            type="file"
            name="profilePicture"
            ref={profileRef}
            onChange={handleImageChange}
          />
          <input
            type="file"
            name="coverPicture"
            ref={coverRef}
            onChange={handleImageChange}
          />
        </div>
      )}
      {location === "home" && (
        <span>
          <Link to={`/profile/${user._id}`}>My Profile</Link>
        </span>
      )}
    </div>
   </>
   
  );
};

export default ProfileCard;
