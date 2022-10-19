import React from "react";

const OnlineCard = ({ userData }) => {
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="user-online-card">
      <img
        loading="lazy"
        crossOrigin="anonymous"
        src={PF + userData.profilePicture}
        alt=""
      />
      <div className="user-online-username">
        <p>{userData.username}</p>
      </div>
      <span className="online-dot"></span>
    </div>
  );
};

export default OnlineCard;
