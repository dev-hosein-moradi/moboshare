import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Users } from "../../dummyData";
import "./popUpMenu.css";

const PopUpMenu = ({ isMenu, setIsMenu }) => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  let menuRef = useRef();

  useEffect(() => {
    /* handle onclick put side */
    let handlerOutSide = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setIsMenu(false);
      }
    };
    document.addEventListener("mousedown", handlerOutSide);

    return () => {
      document.removeEventListener("mousedown", handlerOutSide);
    };
  }, []);

  return (
    <div ref={menuRef} className={`menu-pop`}>
      <div className="top-menu">
        <i
          onClick={() => setIsMenu(!isMenu)}
          className="uil uil-times-circle"
        ></i>
      </div>
      {/* if its group and user is admin */}
      <div className="add-member-box">
        <input
          type="text"
          name="memberID"
          placeholder="username, email..."
          autoComplete="off"
          spellCheck="false"
        />
        <button>
          <i className="uil uil-plus"></i>
        </button>
      </div>
      <div className="error-box">
        <p></p>
      </div>
      {/* if its group */}
      <div className="members-group">
        <h3>members:</h3>
        <div className="members-menu">
          {Users.map((user) => {
            return (
              <div key={user.id} className="member-menu">
                <div className="member-data">
                  <img
                    loading="lazy"
                    crossOrigin="anonymous"
                    src={PF + user.profilePicture}
                  />
                  <p>{user.username}</p>
                </div>
                <div className="member-cta">
                  <i className="uil uil-trash"></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="manu-bottom">
        <button className="bottom-delete">Delete chat</button>
      </div>
    </div>
  );
};

export default PopUpMenu;
