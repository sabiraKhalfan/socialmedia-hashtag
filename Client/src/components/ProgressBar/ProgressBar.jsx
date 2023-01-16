import React from "react";

const ProgressBar = ({ completed }) => {
  const containerStyles = {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 5,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: "#f9a225",
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 1s ease-in-out",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold",
  };
  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span
          style={labelStyles}
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={completed}
        >{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
