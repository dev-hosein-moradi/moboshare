import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const ChatCard = ({
  chatData,
  result,
  privateChat,
  group,
  handleRemoveCoversations,
}) => {
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const baseUri = process.env.REACT_APP_BASE_API;
  const { user } = useContext(AuthContext);
  //data whould be received ==> members, chatName, isGroup, groupAdmin, latestMessage
  const [friendData, setFriendData] = useState(null); //store sender data for private chat.
  const [latestIndex, setLatestIndex] = useState(null);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getPvChatInfo = async () => {
      if (privateChat) {
        try {
          const friendId = chatData?.members?.find((m) => m !== user._id);

          if (friendId) {
            const res = await axios.get(`${baseUri}users?userId=${friendId}`);
            setFriendData(res.data);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    getPvChatInfo();
  }, [baseUri, chatData, privateChat, user]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${baseUri}messages/${chatData?._id}`);
        setLatestIndex(res?.data?.length);
        setLatestMessage(res?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [baseUri, chatData]);
  //console.log(chatData);

  return (
    <div className="chat-item">
      <img
        loading="lazy"
        crossOrigin="anonymous"
        alt={
          result
            ? chatData?.username
            : privateChat
            ? friendData?.username
            : chatData?.chatName
        }
        src={
          result
            ? chatData?.profilePicture
              ? PF + chatData?.profilePicture
              : PF + "person/noAvatar.png"
            : privateChat
            ? friendData?.profilePicture
              ? PF + friendData?.profilePicture
              : PF + "person/noAvatar.png"
            : PF + "person/noAvatar.png"
        }
      />
      <div className="chat-contact-info">
        <h3>
          {result
            ? chatData?.username
            : privateChat
            ? friendData?.username
            : chatData?.chatName}
        </h3>
      </div>
      {!result && (
        <button
          className="chat-card-btn"
          onClick={() => handleRemoveCoversations(chatData)}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ChatCard;
