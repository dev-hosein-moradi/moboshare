import axios from "axios";
import { Image } from "cloudinary-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import TextBox from "../text-box/TextBox";
import "./chatMain.css";

const ChatMain = ({
  newChat,
  setNewChat,
  currentChat,
  setCurrentChat,
  openGroupForm,
  setOpenGroupForm,
  privateChat,
  setPrivateChat,
  groupChat,
  setGroupChat,
  isToolBar,
  setIsToolBar,
  isAside,
}) => {
  const scrollRef = useRef();
  const { user } = useContext(AuthContext);
  /* user env url to import photo path */
  const baseUri = process.env.REACT_APP_BASE_API;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupUsers, setNewGroupUsers] = useState([]);
  const [newGroupPreviewUsers, setNewGroupPreviewUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [currentPvMember, setCurrentPvMember] = useState(null);

  /*  */
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    //get data of current member
    const friendId = currentChat?.members?.filter(
      (member) => member !== user?._id
    );
    const getMemeber = async () => {
      if (currentChat && !currentChat.isGroup && friendId) {
        try {
          const res = await axios.get(`${baseUri}users?userId=${friendId}`);
          setCurrentPvMember(res.data);
        } catch (err) {
          toast.error(err, {
            duration: 4000,
            position: "top-right",
            style: {
              fontSize: "1.4rem",
              fontWeight: "500",
              fontFamily: "inherit",
              backgroundColor: "#b9e8ee",
            },
          });
        }
      }
    };
    getMemeber();
  }, [baseUri, currentChat, user]);
  useEffect(() => {
    //get all users in db
    const getAllUsers = async () => {
      try {
        const res = await axios.get(`${baseUri}users/allusers/${user._id}`);
        setSearchResult(res.data);
      } catch (err) {
        toast.error(err, {
          duration: 4000,
          position: "top-right",
          style: {
            fontSize: "1.4rem",
            fontWeight: "500",
            fontFamily: "inherit",
            backgroundColor: "#b9e8ee",
          },
        });
      }
    };
    getAllUsers();
    //get messages
    const getMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get(`${baseUri}messages/${currentChat?._id}`);
          setMessages(res.data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        toast.error(err, {
          duration: 4000,
          position: "top-right",
          style: {
            fontSize: "1.4rem",
            fontWeight: "500",
            fontFamily: "inherit",
            backgroundColor: "#b9e8ee",
          },
        });
      }
    };
    getMessages();
  }, [baseUri, user, currentChat]);
  /*  */
  const handleSendNewMessage = async () => {
    const newMess = {
      conversationId: currentChat?._id,
      sender: user?._id,
      text: newText,
    };
    if (currentChat) {
      try {
        const sendMessage = await axios.post(`${baseUri}messages/`, newMess);
        setMessages([...messages, sendMessage.data]);
        setNewText("");
      } catch (err) {
        toast.error(err, {
          duration: 4000,
          position: "top-right",
          style: {
            fontSize: "1.4rem",
            fontWeight: "500",
            fontFamily: "inherit",
            backgroundColor: "#b9e8ee",
          },
        });
      }
      const updateConv = {
        latestMessage: newText,
      };
      try {
        await axios.put(
          `${baseUri}conversations/${currentChat?._id}`,
          updateConv
        );
      } catch (error) {
        toast.error(error, {
          duration: 4000,
          position: "top-right",
          style: {
            fontSize: "1.4rem",
            fontWeight: "500",
            fontFamily: "inherit",
            backgroundColor: "#b9e8ee",
          },
        });
      }
    }
  };
  const filterSearchHandler = searchResult.filter(
    (user) =>
      searchKey &&
      (user?.username?.includes(searchKey) || user?.email?.includes(searchKey))
  );
  /*  */
  const onClickCancelForm = () => {
    setOpenGroupForm(false);
    setNewGroupName("");
    setNewGroupPreviewUsers([]);
    setNewGroupUsers([]);
  };
  const onClickCreateForm = async () => {
    const newGroup = {
      chatName: newGroupName,
      users: [...newGroupUsers, user._id],
      isGroup: true,
      groupAdmin: user._id,
    };
    if (newGroupUsers.length >= 2 && newGroupName) {
      try {
        const res = await axios.post(`${baseUri}conversations`, newGroup);
        setGroupChat((prevGroup) => [...prevGroup, res.data]);
        setOpenGroupForm(!openGroupForm);
      } catch (err) {
        console.log(err);
      }
    } else if (newGroupUsers.length < 2) {
      toast.error("you should add at least 2 member.", {
        duration: 4000,
        position: "top-right",
        style: {
          fontSize: "1.4rem",
          fontWeight: "500",
          fontFamily: "inherit",
          backgroundColor: "#b9e8ee",
        },
      });
    } else if (!newGroupName) {
      toast.error("you should enter group name.", {
        duration: 4000,
        position: "top-right",
        style: {
          fontSize: "1.4rem",
          fontWeight: "500",
          fontFamily: "inherit",
          backgroundColor: "#b9e8ee",
        },
      });
    }
  };

  //handle add user to new group for prevent itereate user
  const addUserToNewGroup = (user) => {
    if (!newGroupUsers.includes(user._id)) {
      setNewGroupUsers((prevUser) => [...prevUser, user._id]);
      setNewGroupPreviewUsers((prevUser) => [...prevUser, user]);
    }
    //let withoutDuplicate = [...new Set(newGroupPreviewUsers)];
  };
  const removeSelectedMember = (user) => {
    console.log(user);
    setNewGroupUsers(newGroupUsers.filter((member) => member !== user._id));
    setNewGroupPreviewUsers(
      newGroupPreviewUsers.filter((member) => member._id !== user._id)
    );
  };

  return (
    <div
      className={`main-content ${(isToolBar || isAside) && "low-visibility"}`}
    >
      <Toaster reverseOrder={false} />
      <nav className={`chat-navbar ${openGroupForm && "low-visibility"}`}>
        <div className="nav-chat-data">
          {currentChat &&
            (currentPvMember?.profilePicture ? (
              <Image
                style={{ objectFit: "cover", objectPosition: "center" }}
                className="img"
                loading="lazy"
                crossOrigin="anonymous"
                cloudName="dclzpodah"
                publicId={currentPvMember?.profilePicture}
              />
            ) : (
              <img
                loading="lazy"
                crossOrigin="anonymous"
                alt={
                  currentChat
                    ? currentChat.isGroup
                      ? currentChat.chatName
                      : currentPvMember?.username
                    : newChat?.username
                }
                src={
                  currentChat
                    ? !currentChat.isGroup
                      ? currentPvMember?.profilePicture
                        ? PF + currentPvMember?.profilePicture
                        : PF + "person/noAvatar.png"
                      : PF + "person/noAvatar.png"
                    : PF + "person/noAvatar.png"
                }
              />
            ))}

          <div className="chat-data-member">
            <h6>
              {currentChat
                ? currentChat.isGroup
                  ? currentChat.chatName
                  : currentPvMember?.username
                : newChat
                ? newChat.username
                : null}
            </h6>
          </div>
        </div>
        <div
          onClick={() => setIsToolBar(!isToolBar)}
          className={`nav-chat-menu ${!currentChat && "hide-content"}`}
        >
          <i className="fi fi-sr-menu-dots-vertical"></i>
        </div>
      </nav>
      <section className="chat-messages">
        {messages?.map((message) => (
          <div
            ref={scrollRef}
            key={message._id}
            className={`text-box ${
              message?.sender === user._id ? "sneder-box" : "receiver-box"
            }`}
          >
            <TextBox
              key={message._id}
              messageData={message}
              isOwn={message?.sender === user._id ? true : false}
            />
          </div>
        ))}
        {/*  */}
        <div
          className={`form-create-group ${
            openGroupForm ? "open-group-form" : "close-group-form"
          }`}
        >
          <h1>create new group</h1>
          <label htmlFor="create-groupname">
            Enter Group Name <span>*</span>
          </label>
          <input
            id="create-groupname"
            type="text"
            value={newGroupName}
            name="groupName"
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <div className="form-search-user-box">
            <label>Enter username or email</label>
            <input
              type="text"
              name="searchKey"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <p>Add at least 2 users</p>
            {searchKey && (
              <ul className="users">
                {filterSearchHandler?.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => addUserToNewGroup(user)}
                    className={`user`}
                  >
                    {user?.profilePicture ? (
                      <Image
                        style={{ objectFit: "cover", objectPosition: "center" }}
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
                    <h6>{user?.username}</h6>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <hr style={{ width: "90%", margin: "1rem auto .3rem auto" }} />
          {newGroupPreviewUsers.length !== 0 && (
            <div className="preview-member">
              <p>members: </p>
              <ul className="members">
                {newGroupPreviewUsers?.map((user) => (
                  <li key={user._id} className="member">
                    <img
                      alt={user?.username}
                      src={
                        user?.profilePicture
                          ? PF + user?.profilePicture
                          : PF + "person/noAvatar.png"
                      }
                    />
                    <h6>{user?.username}</h6>
                    <button onClick={() => removeSelectedMember(user)}>
                      <i className="fi fi-rr-trash"></i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-group-create-cta">
            <button className="cancel" onClick={onClickCancelForm}>
              Cancel
            </button>
            <button className="create" onClick={onClickCreateForm}>
              Create
            </button>
          </div>
        </div>
      </section>
      <div
        className={`chat-footer ${openGroupForm && "low-visibility"} ${
          !currentChat && "hide-content"
        }`}
      >
        <div className="footer-box">
          <i className="fi fi-rr-grin"></i>

          <textarea
            spellCheck="false"
            name="newText"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button onClick={handleSendNewMessage}>
            <i className="fi fi-bs-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMain;
