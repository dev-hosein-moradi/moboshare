import axios from "axios";
import { Image } from "cloudinary-react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ToolUserCard from "../user-card/ToolUserCard";
import "./chatToolBar.css";

const ChatToolBar = ({
  isToolBar,
  setIsToolBar,
  currentChat,
  setCurrentChat,
  privateChat,
  setPrivateChat,
  groupChat,
  setGroupChat,
}) => {
  const { user } = useContext(AuthContext);
  const baseUri = process.env.REACT_APP_BASE_API;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [convName, setConvName] = useState("");
  const [isEditName, setIsEditName] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [newUsersPreview, setNewUsersPreview] = useState([]);

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
  //filter all users and map into search result list
  const filterSearchHandler = searchResult.filter(
    (user) =>
      searchKey &&
      (user?.username?.includes(searchKey) || user?.email?.includes(searchKey))
  );

  useEffect(() => {
    setConvName(currentChat?.chatName);
  }, [currentChat]);

  //add new user to exist group and added to new user list
  const addNewUserToGroup = (user) => {
    if (!currentChat?.members?.includes(user?._id)) {
      setNewUsers((prevUser) => [...prevUser, user._id]);
      setNewUsersPreview((prevUser) => [...prevUser, user]);
    }
  };

  //delete chat or group from db
  const removeChat = async () => {
    try {
      const res = await axios.delete(
        `${baseUri}conversations/${currentChat?._id}`
      );
    } catch (err) {
      console.log(err);
    }
    if (currentChat?.isGroup) {
      setGroupChat(
        groupChat?.filter((group) => group?._id !== currentChat?._id)
      );
    }
    if (!currentChat?.isGroup) {
      setPrivateChat(privateChat?.filter((pv) => pv?._id !== currentChat?._id));
    }
    setIsToolBar(false);
    setCurrentChat(null);
  };

  //remove exist member from group
  const handleRemoveMembers = async (memberId) => {
    setCurrentChat((prevData) => {
      return {
        ...prevData,
        members: currentChat?.members?.filter((member) => member !== memberId),
      };
    });
    const newData = {
      members: currentChat?.members?.filter((member) => member !== memberId),
    };
    try {
      const res = await axios.put(
        `${baseUri}conversations/${currentChat?._id}`,
        newData
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //remove user form list of new users
  const onClickRemoveNewUser = (user) => {
    setNewUsersPreview(
      newUsersPreview?.filter((newUser) => newUser._id !== user._id)
    );
    setNewUsers(newUsers?.filter((newUser) => newUser !== user._id));
  };
  //add new user to group and update group
  const addNewUser = async () => {
    setCurrentChat((prevData) => {
      return {
        ...prevData,
        members: [...currentChat.members, ...newUsers],
      };
    });
    const newData = {
      members: [...currentChat?.members, ...newUsers],
    };
    try {
      const res = await axios.put(
        `${baseUri}conversations/${currentChat?._id}`,
        newData
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    setNewUsersPreview([]);
    setNewUsers([]);
  };
  const changeGroupName = async () => {
    setCurrentChat((prevData) => {
      return {
        ...prevData,
        chatName: convName,
      };
    });
    const newData = {
      chatName: convName,
    };
    try {
      const res = await axios.put(
        `${baseUri}conversations/${currentChat?._id}`,
        newData
      );
    } catch (err) {
      console.log(err);
    }
    setIsEditName(false);
  };

  return (
    <div
      className={`chat-tool-bar ${
        isToolBar ? "open-tool-bar" : "close-tool-bar"
      }`}
    >
      <h3 className="tool-bar-header">
        {currentChat
          ? currentChat.isGroup
            ? "group info"
            : "user info"
          : "Detail"}
      </h3>
      <hr style={{ width: "100%", margin: "1rem auto" }} />
      <div className="tool-chat-name">
        <h4>{currentChat?.isGroup ? "group name:" : null}</h4>
        {currentChat && currentChat?.isGroup ? (
          <div className="name-input-box">
            <input
              type="text"
              name="convName"
              className="chat-name"
              value={convName ? convName : ""}
              onChange={(e) => setConvName(e.target.value)}
              disabled={!isEditName}
            />
            <div className="name-input-box-btn">
              {currentChat?.groupAdmin === user._id ? (
                isEditName ? (
                  <>
                    <button
                      className="input-box-btn-save"
                      onClick={changeGroupName}
                    >
                      save
                    </button>
                    <button
                      className="input-box-btn-cancel"
                      onClick={() => setIsEditName(false)}
                    >
                      cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="input-box-btn-edit"
                    onClick={() => setIsEditName(true)}
                  >
                    Edit name
                  </button>
                )
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {/* show member or members to admin and other users */}
      {currentChat ? (
        currentChat.isGroup ? (
          currentChat.groupAdmin === user._id ? (
            <div className="show-members-to-admin">
              <h4>group members:</h4>
              <ul className="members-admin-items">
                {currentChat?.members?.map((member) => (
                  <ToolUserCard
                    key={member}
                    memberData={member}
                    groupAdmin={currentChat?.groupAdmin}
                    forAdmin
                    handleRemoveMembers={handleRemoveMembers}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div className="show-members-to-other">
              <h4>group members:</h4>
              <ul className="members-admin-items">
                {currentChat?.members?.map((member) => (
                  <ToolUserCard
                    key={member}
                    memberData={member}
                    groupAdmin={currentChat?.groupAdmin}
                    forOther
                  />
                ))}
              </ul>
            </div>
          )
        ) : (
          <div className="single-user">
            {currentChat?.isGroup
              ? null
              : currentChat?.members
                  ?.filter((filterMember) => filterMember !== user._id)
                  .map((member) => (
                    <ToolUserCard key={member} memberData={member} singleChat />
                  ))}
          </div>
        )
      ) : null}
      {/* panel for admin to add new user to group */}
      <div
        className={`user-added-container-admin ${
          currentChat &&
          currentChat?.isGroup &&
          currentChat?.groupAdmin === user._id &&
          "show-add-panel"
        }`}
      >
        <div className="panel-search-box-toolbar">
          <label htmlFor="toolbar-search">search new user:</label>
          <div className="box-input-btn-toolbar">
            <input
              id="toolbar-search"
              type="text"
              name="newUserToolbar"
              onChange={(e) => setSearchKey(e.target.value)}
            />
            {newUsers?.length !== 0 && (
              <button onClick={addNewUser}>Add</button>
            )}
          </div>
          {currentChat?.groupAdmin === user._id &&
            filterSearchHandler?.length !== 0 && (
              <ul className="search-toolbar-list">
                {searchKey &&
                  filterSearchHandler?.map((user) => (
                    <li
                      className="search-result-toolbar-item"
                      key={user._id}
                      onClick={() => addNewUserToGroup(user)}
                    >
                      {user?.profilePicture ? (
                        <Image
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          className="img"
                          loading="lazy"
                          crossOrigin="anonymous"
                          cloudName="dclzpodah"
                          publicId={user?.profilePicture}
                        />
                      ) : (
                        <img
                          loading="lazy"
                          crossOrigin="anonymous"
                          src={PF + "person/noAvatar.png"}
                          alt="avatar"
                        />
                      )}
                      <p>{user?.username}</p>
                    </li>
                  ))}
              </ul>
            )}
          {currentChat?.groupAdmin === user._id &&
            newUsersPreview.length !== 0 && (
              <hr style={{ margin: "1rem auto" }} />
            )}

          {currentChat?.groupAdmin === user._id && newUsers?.length !== 0 && (
            <>
              <h5>new members:</h5>
              <ul className="search-toolbar-list preview">
                {newUsers?.length !== 0 &&
                  newUsersPreview?.map((user) => (
                    <li className="search-result-toolbar-item" key={user._id}>
                      <img
                        alt={user?.username}
                        src={
                          user?.profilePicture
                            ? PF + user.profilePicture
                            : PF + "person/noAvatar.png"
                        }
                      />
                      <p>{user?.username}</p>
                      <button onClick={() => onClickRemoveNewUser(user)}>
                        <i className="fi fi-rr-trash"></i>
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* cta for tool bar */}
      <div className="chat-toolbar-cta">
        <button
          className="toolbar-close-btn"
          onClick={() => setIsToolBar(!isToolBar)}
        >
          Close
        </button>
        {currentChat?.isGroup ? (
          <button className="toolbar-left-btn" onClick={removeChat}>
            Left
          </button>
        ) : (
          <button className="toolbar-remove-btn" onClick={removeChat}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatToolBar;
