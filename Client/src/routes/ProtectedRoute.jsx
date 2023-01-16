import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state?.authReducer?.authData?.user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!user?.isVerified) {
    return <Navigate to="/verify" />;
  }
  return children;
}

export default ProtectedRoute;
