import { Image } from "cloudinary-react";
import React from "react";

const OnlineCard = ({ userData }) => {
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="user-online-card">
      {userData?.profilePicture ? (
        <Image
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="img"
          loading="lazy"
          crossOrigin="anonymous"
          cloudName="dclzpodah"
          publicId={userData?.profilePicture}
        />
      ) : (
        <img
          loading="lazy"
          crossOrigin="anonymous"
          src={PF + "person/noAvatar.png"}
          alt="avatar"
        />
      )}
      <div className="user-online-username">
        <p>{userData.username}</p>
      </div>
      <span className="online-dot"></span>
    </div>
  );
};

export default OnlineCard;
