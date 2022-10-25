import axios from "axios";
import { Image } from "cloudinary-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./userCard.css";

const ToolUserCard = ({
  memberData,
  groupAdmin,
  forAdmin,
  forOther,
  handleRemoveMembers,
}) => {
  const { user } = useContext(AuthContext);
  const baseUri = process.env.REACT_APP_BASE_API;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [currentMember, setCurrentMember] = useState(null);

  useEffect(() => {
    //get full data of member
    const getMember = async () => {
      try {
        const res = await axios.get(`${baseUri}users?userId=${memberData}`);
        setCurrentMember(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMember();
  }, [baseUri, memberData]);

  return (
    <li className="tool-member-item">
      {currentMember?.profilePicture ? (
        <Image
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="img"
          loading="lazy"
          crossOrigin="anonymous"
          cloudName="dclzpodah"
          publicId={currentMember?.profilePicture}
        />
      ) : (
        <img
          loading="lazy"
          crossOrigin="anonymous"
          src={PF + "person/noAvatar.png"}
          alt="avatar"
        />
      )}

      <div className="member-tool-item-name">
        <p>{currentMember?.username}</p>
        {currentMember?._id === groupAdmin && (
          <p className="item-admin">Admin</p>
        )}
      </div>
      {groupAdmin === user?._id && memberData !== groupAdmin ? (
        <button
          className="tool-item-btn"
          onClick={() => handleRemoveMembers(memberData)}
        >
          remove
        </button>
      ) : null}
    </li>
  );
};

export default ToolUserCard;
