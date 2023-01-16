import React from "react";
import "./Profile.css"
//import LogoSearch from "../LogoSearch/LogoSearch";
import ProfileCard from "../ProfileCard/ProfileCard";

const Profile = () => {
  return (<>
  
   <div className="ProfileSide">
      {/* <LogoSearch /> */}
      <div className="webName">
          <h2>Hashtag</h2>
          <h6>Explore the ideas throughout the world</h6>
        </div>
      <ProfileCard location={"home"} />
    </div>
  </>
   
  );
};

export default Profile;
