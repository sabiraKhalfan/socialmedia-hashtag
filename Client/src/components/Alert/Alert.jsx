import React from "react";
import "./Alert.css";

const Alert = ({ message, handleCloseAlert }) => {
  return (
    <div className="alert-box">
      <p className="alert">{message}</p>
      <span onClick={handleCloseAlert}>x</span>
    </div>
  );
};

export default Alert;
