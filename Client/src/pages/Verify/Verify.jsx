import "./Verify.css";
import email from "../../img/email.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import { useEffect } from "react";
import { resendVerification } from "../../api/AuthRequest";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyAccount } from "../../actions/AuthAction";

const override = {
  display: "block",
  margin: "0 auto",
};
const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pendingResend, setPendingResend] = useState(false);
  const { user } = useSelector((state) => state.authReducer.authData);
  const { loading, message } = useSelector((state) => state.authReducer);

  const userId = searchParams.get("account");
  const token = searchParams.get("token");

  const handleResendVerification = async () => {
    try {
      setPendingResend(true);
      await resendVerification(user._id);
      setPendingResend(false);
      dispatch({ type: "RESET" });
      navigate("/verify");
    } catch (err) {
      setPendingResend(false);
      console.log(err);
    }
  };
  useEffect(() => {
    if (userId && token) {
      dispatch(verifyAccount(userId, token));
    }
  }, []);
  return (
    <div className="mail-verify">
      <img src={email} alt="" />
      {!(userId || token) && (
        <p>
          A verification link has been sent to you mail. Please check your mail
          and verify your account
        </p>
      )}
      {message && <p>{message}</p>}
      {userId && token && (
        <FadeLoader color="orange" cssOverride={override} loading={loading} />
      )}

      <div>
        {
          <button
            className="button button-logout"
            onClick={() => dispatch({ type: "LOGOUT" })}
          >
            Logout
          </button>
        }
        {!pendingResend && (
          <button
            className="button button-verify"
            onClick={handleResendVerification}
          >
            send again
          </button>
        )}
        {pendingResend && (
          <button disabled={pendingResend} className="button button-verify">
            Sending...
          </button>
        )}
      </div>
    </div>
  );
};

export default Verify;
