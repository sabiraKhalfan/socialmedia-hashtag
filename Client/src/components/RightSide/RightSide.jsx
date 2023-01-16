import "./RightSide.css";
import FollowersCard from "../FollowersCard/FollowersCard";
import NavBar from "../NavBar/NavBar";

export const RightSide = () => {
  return (
    <div className="rightSide">
      <NavBar />
      <FollowersCard />
    </div>
  );
};
