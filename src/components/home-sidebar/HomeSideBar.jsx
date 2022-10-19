import React from "react";
import "./homeSidebar.css";
import { useNavigate } from "react-router-dom";

const HomeSideBar = ({ setAside }) => {
  const navigate = useNavigate();
  const handleLogOut = () => {
    navigate("/login");
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div className="close__side__handler">
        <i
          onClick={() => setAside(false)}
          className="fa-regular fa-circle-xmark"
        ></i>
      </div>

      <div className="main__side__item">
        <div className="item">
          <i className="fa-solid fa-message"></i>
          <h3>Chat</h3>
        </div>
        <div className="item">
          <i className="fa-solid fa-graduation-cap"></i>
          <h3>Courses</h3>
        </div>
        <div className="item">
          <i className="fa-solid fa-bookmark"></i>
          <h3>Bookmarks</h3>
        </div>
        <div className="item">
          <i className="fa-solid fa-circle-question"></i>
          <h3>Questions</h3>
        </div>
        <div className="item">
          <i className="fa-solid fa-briefcase"></i>
          <h3>Jobs</h3>
        </div>
        <div className="item">
          <i className="fa-solid fa-calendar-days"></i>
          <h3>Events</h3>
        </div>
        <div className="item" onClick={handleLogOut}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <h3>Logout</h3>
        </div>
      </div>
    </>
  );
};

export default HomeSideBar;
