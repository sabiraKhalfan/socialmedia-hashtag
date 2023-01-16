import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { logIn, signUp } from "../../actions/AuthAction";
import Alert from "../../components/Alert/Alert";
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
const firstNameRegex=/^[a-zA-Z]{3,}$/;
const lastNameRegex = /^[a-zA-Z]{3,}$/;

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.authReducer);
  const [validationMessage, setValidationMessage] = useState("");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((preData) => {
      return {
        ...preData,
        [name]: value,
      };
    });
    setValidationMessage("");
  };

  const validate = () => {
    if (data.email && !emailRegex.test(data.email)) {
      setValidationMessage("Please enter a valid email");
      return false;
    }

    if (!usernameRegex.test(data.username)) {
      setValidationMessage(
        "Enter a valid username no special character no whitespace"
      );
      return false
    }
    
   
    
   
    if (data.password.length < 5) {
      
      setValidationMessage("Password minimum length is 5");
      return false;
    }

    if (isSignUp && data.confirmedPassword !== data.password) {
      setValidationMessage("password doesn't matching");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignUp && validate()) {
      return dispatch(logIn(data));
    }
    if (validate()) {
      return dispatch(signUp(data));
    }
  };

  const resetForm = () => {
    setValidationMessage("");
    setData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmedPassword: "",
    });
  };
  return (
    <div className="auth">
      <div className="a-left">
        {/* <img src={Logo} alt="logo" /> */}
        <div className="webName">
          <h1>Hashtag</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div>
      </div>
      <div className="a-right">
        <div className="">
          <form className="infoForm authForm" onSubmit={handleSubmit}>
            <h3>{isSignUp ? "Sign up" : "Sign In"}</h3>
            {isSignUp && (
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="infoInput"
                  name="firstName"
                  onChange={handleChange}
                  value={data.firstName}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="infoInput"
                  name="lastName"
                  onChange={handleChange}
                  value={data.lastName}
                />
              </div>
            )}
            {isSignUp && (
              <div>
                <input
                  type="email"
                  className="infoInput"
                  name="email"
                  placeholder="email"
                  onChange={handleChange}
                  value={data.email}
                />
              </div>
            )}
            <div>
              <input
                type="text"
                className="infoInput"
                name="username"
                placeholder="username"
                onChange={handleChange}
                value={data.username}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="infoInput"
                onChange={handleChange}
                value={data.password}
              />
              {isSignUp && (
                <input
                  type="password"
                  name="confirmedPassword"
                  className="infoInput"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  value={data.confirmedPassword}
                />
              )}
            </div>
            <div>
              <span
                style={{ fontSize: "12px", cursor: "pointer" }}
                onClick={() => {
                  setIsSignUp((pre) => !pre);
                  resetForm();
                }}
              >
                {isSignUp
                  ? "Already have an account?. Sign in"
                  : "Don't have an account?. Sign up"}
              </span>

              <button disabled={loading} className="button info-button">
                {loading ? "Loading..." : isSignUp ? "Sign up" : "Login"}
              </button>
            </div>
          </form>
        </div>
        {validationMessage && (
          <Alert
            message={validationMessage}
            handleCloseAlert={() => setValidationMessage("")}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
