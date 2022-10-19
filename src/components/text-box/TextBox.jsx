import axios from "axios";
import React, { useEffect, useState } from "react";
import "./textBox.css";
import { DateTime } from "luxon";

const TextBox = ({ isOwn, messageData }) => {
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const baseUri = process.env.REACT_APP_BASE_API;
  //handle text stly depande on user`s keyboard language
  const [messageDetail, setMessageDetail] = useState(null);
  useEffect(() => {
    //get detail of message
    const getDetail = async () => {
      try {
        const res = await axios.get(
          `${baseUri}users?userId=${messageData?.sender}`
        );
        setMessageDetail(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getDetail();
  }, [baseUri, messageData]);
  return (
    <>
      <p className="box-message">{messageData?.text}</p>
      <div className="message-sender-data">
        {!isOwn && (
          <>
            <img
              loading="lazy"
              crossOrigin="anonymous"
              alt=""
              src={PF + "person/noAvatar.png"}
            />
            <p>{messageDetail?.username}</p>
          </>
        )}

        <p>{DateTime.fromISO(messageData?.createdAt).toFormat("t")}</p>
      </div>
    </>
  );
};

export default TextBox;
