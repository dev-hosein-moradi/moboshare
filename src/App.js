import React, { useContext, useEffect, useState } from "react";
import Home from "./page/home/Home";
import "./App.css";
import Profile from "./page/profile/Profile";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./page/authentication/Login";
import Register from "./page/authentication/Register";
import { AuthContext } from "./context/AuthContext";
import ChatApp from "./page/chat-app/ChatApp";
import StartGuid from "./page/start-guid/StartGuid";
import StartUpBrand from "./components/start-up-brand/StartUpBrand";
import EditProfile from "./components/edit-profile/EditProfile";

const App = () => {
  const { user } = useContext(AuthContext);
  const [height, setHeight] = useState(visualViewport.height);
  const [isAnimation, setIsAnimation] = useState(false);
  document.documentElement.style.setProperty("--visual-height", `${height}px`);

  const handleHeight = () => {
    document.documentElement.style.setProperty(
      "--visual-height",
      `${height}px`
    );
    setHeight(visualViewport.height);
  };

  useEffect(() => {
    window.addEventListener("resize", handleHeight);
    return () => {
      window.removeEventListener("resize", handleHeight);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("brandAnimation") === null) {
      localStorage.setItem("brandAnimation", "true");
      setIsAnimation(true);
      window.addEventListener("load", () => {});
    }

    const removeAnimation = setTimeout(() => {
      if (localStorage.getItem("brandAnimation") === "true" && isAnimation) {
        localStorage.setItem("brandAnimation", "false");
        setIsAnimation(false);
      }
    }, 4000);

    return () => {
      clearTimeout(removeAnimation);
    };
  }, [isAnimation]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              user ? (
                <Home username={user?.username} />
              ) : (
                <Navigate to="/register" />
              )
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/guid" />
              ) : isAnimation ? (
                <StartUpBrand />
              ) : (
                <Register />
              )
            }
          />
          <Route path="/guid" element={user ? <StartGuid /> : <Register />} />
          <Route
            path="/messenger"
            element={!user ? <Navigate to="/" /> : <ChatApp />}
          />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/:username/personalinfo" element={<EditProfile />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
