import React, { useContext, useEffect, useRef, useState } from "react";
import "./chatAside.css";
import axios from "axios";
import ChatCard from "../user-card/ChatCard";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";

const ChatAside = ({
  isAside,
  setIsAside,
  setNewChat,
  setCurrentChat,
  openGroupForm,
  setOpenGroupForm,
  privateChat,
  setPrivateChat,
  groupChat,
  setGroupChat,
  isToolBar,
  setIsToolBar,
}) => {
  const baseUri = process.env.REACT_APP_BASE_API;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    //get all users in db
    const getAllUsers = async () => {
      try {
        const res = await axios.get(`${baseUri}users/allusers/${user._id}`);
        setSearchResult(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllUsers();
  }, [baseUri, user]);

  //search filter handler for user and return data depand on username or email
  const filterSearchHandler = searchResult.filter(
    (user) =>
      searchKey &&
      (user?.username?.includes(searchKey) || user?.email?.includes(searchKey))
  );
  // check for clicked on result search user for if conversation with this user already exist sned conv data to currentChat state
  //and if dont exist any conversation with selected user, send id of user to newChat state.
  const handleSelectChatResult = async (conv) => {
    let existChat = privateChat?.filter((spv) =>
      spv?.members?.includes(conv?._id)
    );
    if (existChat?.length !== 0) {
      setCurrentChat(existChat[0]);
    } else {
      const newConv = {
        users: [user._id, conv._id],
      };
      try {
        const createConv = await axios.post(
          `${baseUri}conversations/`,
          newConv
        );
        setCurrentChat(createConv.data);
      } catch (err) {
        console.log(err);
      }
    }
    setIsAside(false);
  };

  //handle logic for delete chat or group in side bar or in other word remove it from user history
  const handleRemoveCoversations = async (chatData) => {
    try {
      const res = await axios.delete(
        `${baseUri}conversations/${chatData?._id}`
      );
    } catch (err) {
      console.log(err);
    }
    if (chatData?.isGroup) {
      setGroupChat(groupChat?.filter((group) => group?._id !== chatData?._id));
    }
    if (!chatData?.isGroup) {
      setPrivateChat(privateChat?.filter((pv) => pv?._id !== chatData?._id));
    }
    setCurrentChat(null);
  };

  const onClickExistGroup = (chat) => {
    setCurrentChat(chat);
    setIsAside(false);
  };
  const onClickExistChat = (chat) => {
    setCurrentChat(chat);
    setIsAside(false);
  };

  return (
    <>
      <button
        onClick={() => setIsAside(!isAside)}
        className={`menu-toggler ${
          isAside ? "toggler-open-aside" : "toggler-close-aside"
        }`}
      >
        Menu
      </button>
      <section
        className={`chat-aside-container ${
          isAside ? "toggle-open-aside" : "toggle-close-aside"
        }`}
      >
        <div className="aside-navagation">
          <div className="profile-img">
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
          <div className="bar-item-chat home">
            <Link to={`/`}>
              <i className="fa-solid fa-house"></i>
            </Link>
          </div>
        </div>
        <div className="aside-searchBar">
          <div className="search-box">
            <label htmlFor="search">search username or email</label>
            <input
              id="search"
              type="text"
              name="searchkey"
              autoComplete="username"
              onChange={(e) => setSearchKey(e.target.value)}
              value={searchKey}
              spellCheck="false"
            />

            {/* result of search */}
            <ul className="result-list">
              {filterSearchHandler
                ? filterSearchHandler?.map((conv) => (
                    <div
                      key={conv._id}
                      onClick={() => handleSelectChatResult(conv)}
                    >
                      <ChatCard result key={conv._id} chatData={conv} />
                    </div>
                  ))
                : searchKey && "user not found!"}
            </ul>
          </div>
        </div>
        {!searchKey && (
          <>
            <div className="aside-group-list">
              <div
                onClick={() => {
                  return setOpenGroupForm(true), setIsAside(!isAside), setCurrentChat(null);
                }}
                className="aside-group-creator"
              >
                new Group
              </div>
              {groupChat?.length !== 0 && <h1># Group</h1>}
              {groupChat?.length !== 0 && (
                <hr
                  style={{
                    width: "100%",
                    margin: ".2rem auto .5rem auto",
                    borderColor: "var(--border-bg-color)",
                  }}
                />
              )}

              {groupChat?.map((chat) => (
                <div key={chat._id} onClick={() => onClickExistGroup(chat)}>
                  <ChatCard
                    group
                    key={chat._id}
                    chatData={chat}
                    handleRemoveCoversations={handleRemoveCoversations}
                  />
                </div>
              ))}
            </div>

            <div className="aside-private-list">
              {privateChat?.length !== 0 && <h1>Chats</h1>}
              {privateChat?.length !== 0 && (
                <hr
                  style={{
                    width: "100%",
                    height: "0",
                    margin: "0rem auto .5rem auto",
                    borderColor: "var(--border-bg-color)",
                  }}
                />
              )}

              {privateChat?.map((chat) => (
                <div key={chat._id} onClick={() => onClickExistChat(chat)}>
                  <ChatCard
                    privateChat
                    key={chat._id}
                    chatData={chat}
                    handleRemoveCoversations={handleRemoveCoversations}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default ChatAside;
