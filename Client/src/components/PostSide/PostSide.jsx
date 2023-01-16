import React from "react";
import { useParams } from "react-router-dom";
// import Gallery from "../Gallery/Gallery";
import Posts from "../Posts/Posts";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";

const PostSide = () => {
  const params = useParams();

  return (
    <div className="postSide">
      {!params.id && <PostShare />}
      <Posts />
      {/* <Gallery /> */}
    </div>
  );
};

export default PostSide;
