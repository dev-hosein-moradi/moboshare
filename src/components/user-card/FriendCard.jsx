import { Image } from "cloudinary-react";
import React from "react";
import { Link } from "react-router-dom";
import "./userCard.css";

const FriendCard = ({ friendData }) => {
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Link to={"/profile/" + friendData.username}>
      <div className="friends-item">
        {friendData?.profilePicture ? (
          <Image
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="img"
            loading="lazy"
            crossOrigin="anonymous"
            cloudName="dclzpodah"
            publicId={friendData?.profilePicture}
          />
        ) : (
          <img
            loading="lazy"
            crossOrigin="anonymous"
            src={PF + "person/noAvatar.png"}
            alt="avatar"
          />
        )}
        <h3>{friendData.username}</h3>
      </div>
    </Link>
  );
};

export default FriendCard;
