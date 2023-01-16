import "./App.css";
import React, { Suspense } from "react";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Auth from "./pages/Auth/Auth";
import { Route, Routes, Navigate } from "react-router-dom";
import { Error } from "./pages/404/Error";
import Verify from "./pages/Verify/Verify";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
const Chat = React.lazy(() => import("./pages/Chat/Chat"));

function App() {
  const user = useSelector((state) => state?.authReducer?.authData?.user);
  return (
    <div className="App">
      <div className="blur blur-primary"></div>
      <div className="blur blur-secondary"></div>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/home" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        <Route
          path="/verify"
          element={
            user && !user.isVerified ? <Verify /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <Chat />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/error" element={<Error />} />
        <Route path="/*" element={<Navigate to="/error" />} />
      </Routes>
    </div>
  );
}

export default App;
