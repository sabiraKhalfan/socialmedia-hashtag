import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getUserDetails } from "../../api/UserRequest";
const serverImages = process.env.REACT_APP_PUBLIC_IMAGES;
const serverStatic = process.env.REACT_APP_STATIC_FOLDER;

const Conversation = ({ room, isOnline }) => {
  const [memberData, setMemberData] = useState({});
  const { user } = useSelector((state) => state.authReducer.authData);
  useEffect(() => {
    const memberId = room.members.find((id) => id !== user._id);
    const getUserData = async () => {
      const { data } = await getUserDetails(memberId);
      setMemberData(data);
    };
    getUserData();
  }, []);

  return (
    <>
      <div className="followers conversation">
        <div>
          {isOnline && <div className="online-dot"></div>}
          <img
            className="followerImg"
            src={
              memberData.profilePicture
                ? `${serverImages}/${memberData.profilePicture}`
                : `${serverStatic}/profile.jpg`
            }
            alt=""
          />
          <div className="name">
            <span>
              {memberData?.firstName} {memberData?.lastName}
            </span>
            <span>{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: " 85%", border: "0.1px solid #ece8e8e1" }} />
    </>
  );
};

export default Conversation;
