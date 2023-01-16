import "./NavBar.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link} from "react-router-dom";
import Home from "../../img/home.png";

import Chat from "../../img/comment.png";
import { getNotifications } from "../../actions/UserAction";
import useComponentVisible from "../../hooks/useComponentVisible";

const NavBar = () => {
  const dispatch = useDispatch();

  
  const { dropdownRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  useEffect(() => {
    dispatch(getNotifications());
  }, [location]);
  return (
    <div className="navIcons">
      <Link to="/home">
        <img src={Home} alt="Home" />
      </Link>
  
      <Link to="/chat">
        <img src={Chat} alt="comment" />
      </Link>
    </div>
  );
};

export default NavBar;
