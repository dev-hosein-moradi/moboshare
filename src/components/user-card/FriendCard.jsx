import React from "react";
import { Link } from "react-router-dom";
import "./userCard.css";

const FriendCard = ({ friendData }) => {
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Link to={"/profile/" + friendData.username}>
      <div className="friends-item">
        <img
          loading="lazy"
          crossOrigin="anonymous"
          alt=""
          src={
            friendData.profilePicture
              ? PF + friendData.profilePicture
              : PF + "person/noAvatar.png"
          }
        />
        <h3>{friendData.username}</h3>
      </div>
    </Link>
  );
};

export default FriendCard;
