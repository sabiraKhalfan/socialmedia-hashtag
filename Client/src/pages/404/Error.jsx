import React from "react";
import { useNavigate } from "react-router-dom";
import "./Error.css";

export const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="error">
      <h1>404</h1>
      <p>Are you lost ?</p>
      <button onClick={() => navigate("/")} className="button fc-button">
        Go Home
      </button>
    </div>
  );
};
