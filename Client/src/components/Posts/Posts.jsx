import "./Posts.css";
import React, { useEffect, useRef, useCallback } from "react";
import Post from "../Post/Post";
import FadeLoader from "react-spinners/FadeLoader";
import { useLocation, useParams } from "react-router-dom";
import useFetchPosts from "../../hooks/useFetchPosts";
import { useState } from "react";
import AllCaughtUp from "../AllCaughtUp/AllCaughtUp";
import { useSelector } from "react-redux";
import NoPost from "../NoPost/NoPost";
const override = {
  display: "block",
  margin: "0 auto",
};
const Posts = () => {
  console.log("posts");
  const [skip, setSkip] = useState(0);
  const [isTimeline, setIsTimeline] = useState(true);
  const location = useLocation();
  const params = useParams();
  const { posts } = useSelector((state) => state.postReducer);
  const { loading, hasMore } = useFetchPosts(
    params.id,
    isTimeline,
    skip,
    location
  );
  const observer = useRef();
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip((pre) => pre + 3);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setSkip(0);
    if (location.pathname === "/home") {
      setIsTimeline(true);
    } else {
      setIsTimeline(false);
    }
  }, [location]);

  return (
    <div className="posts">
      {posts?.map((post, index) => {
        if (posts.length === index + 1) {
          return <Post ref={lastPostRef} key={post._id} data={post} />;
        }
        return <Post key={post._id} data={post} />;
      })}
      <FadeLoader color="orange" cssOverride={override} loading={loading} />
      {posts.length === 0 && !loading && !hasMore && <NoPost />}
      {posts.length > 0 && !loading && !hasMore && <AllCaughtUp />}
    </div>
  );
};

export default Posts;
