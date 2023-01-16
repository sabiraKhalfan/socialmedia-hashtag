import React, { useState, useRef } from "react";
import "./PostShare.css";
import {
  UilScenery,
  UilPlayCircle,
  UilSchedule,
  UilTimes,
} from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../actions/PostAction";
import ProgressBar from "../ProgressBar/ProgressBar";
import axios from "axios";
import ScheduledModal from "../ScheduledModal/ScheduledModal";
import { toast } from "react-hot-toast";
const storedToken = localStorage.getItem("token");
const token = JSON.parse(storedToken);

const serverImages = process.env.REACT_APP_PUBLIC_IMAGES;
const serverStatic = process.env.REACT_APP_STATIC_FOLDER;

const PostShare = ({ isScheduling, scheduledDate, closeSchedule }) => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [postDescription, setPostDescription] = useState("");
  const { user } = useSelector((state) => state.authReducer.authData);
  const [uploading, setUploading] = useState(null);
  const dispatch = useDispatch();
  const imageRef = useRef();
  const videoRef = useRef();
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };
  const handleVideoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let myVideo = event.target.files[0];
      setVideo(myVideo);
    }
  };
  const reset = () => {
    setImage(null);
    setVideo(null);
    setUploading(null);
    setShowLocation(false);
    setPostDescription("");
  };
  const handlePostSubmit = async (event) => {
    event.preventDefault();

    //closing schedule modal
    isScheduling && closeSchedule();

    if (postDescription.trim().length === 0) return;

    const newPost = {
      description: postDescription,
      scheduledDate: scheduledDate,
    };
    if (image) {
      if(!(image.type==="image/jpeg" || 
         image.type==="image/png" ||
         image.type==="image/webp"||
         image.type==="image/jpg")
         )
         {
          return toast("oops! only support jpeg,png,jpg",{
            icon: "🙄",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
         }

      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append("name", fileName);
      data.append("file", image);

      try {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/upload/image`,
          data,
          {
            withCredentials: true,
            headers: `Bearer ${token}`,
            onUploadProgress: (uploadEvent) =>
              setUploading(
                parseInt(
                  Math.round((uploadEvent.loaded * 100) / uploadEvent.total)
                )
              ),
          }
        );
        newPost.image = fileName;
        dispatch(createPost(newPost));
        reset();
      } catch (err) {
        return console.log(err);
      }
    } else if (video) {
      const data = new FormData();
      const fileName = Date.now() + video.name.replaceAll(" ", "");
      data.append("name", fileName);
      data.append("file", video);
      try {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/upload/video`,
          data,
          {
            withCredentials: true,
            headers: `Bearer ${token}`,
            onUploadProgress: (uploadEvent) =>
              setUploading(
                parseInt(
                  Math.round((uploadEvent.loaded * 100) / uploadEvent.total)
                )
              ),
          }
        );
        newPost.video = fileName;
        dispatch(createPost(newPost));
        reset();
      } catch (err) {
        return console.log(err);
      }

    } else {
      dispatch(createPost(newPost));
      reset();
    }
  };

  const handleSetLocation = () => {
    navigator?.geolocation?.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (err) => {
        console.log(err);
        if (err.code === 1) {
          return alert("Please allow location service");
        }
      }
    );
    setShowLocation((pre) => !pre);
  };

  return (
    <>
      <ScheduledModal
        openSchedule={openSchedule}
        closeSchedule={() => setOpenSchedule(false)}
      />
      <form onSubmit={handlePostSubmit}>
        <div className="postShare">
          <img
            src={
              user.profilePicture
                ? `${serverImages}/${user.profilePicture}`
                : `${serverStatic}/profile.jpg`
            }
            alt=""
          />
          <div>
            <input
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              required
              type="text"
              placeholder="What's happening"
            />
            <div className="postOptions">
              <div
                className="option"
                style={{ color: "var(--photo)" }}
                onClick={() => imageRef.current.click()}
              >
                <UilScenery />
                Photo
              </div>
              <div
                className="option"
                style={{ color: "var(--video)" }}
                onClick={() => videoRef.current.click()}
              >
                <UilPlayCircle />
                Video
              </div>

              {/* checking the whether its inside schedule modal or not */}
              {!isScheduling && (
                <div
                  className="option"
                  style={{ color: "var(--schedule)" }}
                  onClick={() => setOpenSchedule((pre) => !pre)}
                >
                  <UilSchedule />
                  Schedule
                </div>
              )}
              {postDescription.trim() && !isScheduling && (
                <button className="button ps-button" disabled={uploading}>
                  {uploading ? "Uploading..." : "Share"}
                </button>
              )}
              <div style={{ display: "none" }}>
                <input
                  type="file"
                  name="newImage"
                  ref={imageRef}
                  onChange={handleImageChange}
                />
                <input
                  type="file"
                  name="newVideo"
                  accept="video/*"
                  ref={videoRef}
                  onChange={handleVideoChange}
                />
              </div>
            </div>
            {(image || video) && (
              <div className="previewImage">
                <UilTimes
                  onClick={() => {
                    setImage(null);
                    setVideo(null);
                    imageRef.current.value = null;
                    videoRef.current.value = null;
                    setShowLocation(false);
                  }}
                />
                {image && <img src={URL.createObjectURL(image)} alt="" />}
                {video && (
                  <video controls>
                    <source src={URL.createObjectURL(video)} />
                  </video>
                )}
                {uploading && <ProgressBar completed={uploading} />}
              </div>
            )}
          </div>
        </div>
        {isScheduling && (
          <button
            className="schedule-button"
            disabled={!postDescription.trim()}
            onSubmit={handlePostSubmit}
          >
            Schedule
          </button>
        )}
      </form>
      <div className="spinner"></div>
    </>
  );
};

export default PostShare;
