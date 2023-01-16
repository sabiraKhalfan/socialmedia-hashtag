import "./FollowersCard.css";
import React, { useEffect } from "react";
import User from "../User/User";
import { useState } from "react";
import { getAllUsers } from "../../api/UserRequest";

const FollowersCard = () => {
  console.log("follower card")
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="followersCard">
      <h3>People you may know</h3>
      {users.map((user) => {
        return <User key={user._id} user={user} />;
      })}
    </div>
  );
};

export default FollowersCard;
