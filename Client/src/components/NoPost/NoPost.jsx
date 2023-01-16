import noPost from "../../img/noPost.png";
import "./NoPost.css" 
const NoPost = () => {
  return (
    <div className="noPost">
      <img src={noPost} alt="" />
      <p>No post yet.</p>
    </div>
  );
};

export default NoPost;
