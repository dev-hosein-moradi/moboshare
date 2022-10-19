import React, { useContext } from "react";
import "./topBar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Image } from "cloudinary-react";

const TopBar = () => {
  const { user } = useContext(AuthContext);
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <header className={`topbar__container `}>
      <div className={`left__bar`}>
        <Link to="/">
          <h1>MoboShare</h1>
        </Link>
      </div>
      <div className={`right__bar`}>
        <div className="profile__img">
          <Link to={`/profile/${user.username}`}>
            {user.profilePicture ? (
              <Image
                style={{ objectFit: "cover", objectPosition: "center" }}
                className="img"
                loading="lazy"
                crossOrigin="anonymous"
                cloudName="dclzpodah"
                publicId={user.profilePicture}
              />
            ) : (
              <img
                loading="lazy"
                crossOrigin="anonymous"
                src={PF + "person/noAvatar.png"}
                alt="avatar"
              />
            )}
          </Link>
        </div>

        <div className="bar__item search">
          <i className="fa-solid fa-magnifying-glass-plus"></i>
        </div>
        <div className="bar__item message">
          <Link to="/messenger">
            <i className="fa-solid fa-message"></i>
          </Link>
        </div>
        <div className="bar__item home-icon">
          <Link to={`/`}>
            <i className="fa-solid fa-house"></i>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
