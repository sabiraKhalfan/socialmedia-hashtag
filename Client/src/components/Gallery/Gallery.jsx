import React from "react";
import "./Gallery.css";
import { postsData } from "../../Data/PostData";

const Gallery = () => {
  return (
    <div className="gallery">
      {postsData.map((post) => {
        return (
          <div key={post.id} className="galleryImg">
            <img src={post.img} alt="" />
            {/* <p>{post.desc}</p> */}
          </div>
        );
      })}
    </div>
  );
};

export default Gallery;
