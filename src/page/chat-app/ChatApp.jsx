import React, { useContext, useEffect, useRef, useState } from "react";
import "./chatApp.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import ChatAside from "../../components/chat-aside/ChatAside";
import ChatMain from "../../components/chat-main/ChatMain";
import ChatToolBar from "../../components/chat-tool-bar/ChatToolBar";

const Messenger = () => {
  let menuRef = useRef();
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const baseUri = process.env.REACT_APP_BASE_API;
  const wsApi = process.env.REACT_APP_WS_API;

  /* state */
  const [isAside, setIsAside] = useState(false);
  const [openGroupForm, setOpenGroupForm] = useState(false);
  const [isToolBar, setIsToolBar] = useState(false);
  const [newChat, setNewChat] = useState(null); //for store data of chat that didnt exist.
  const [currentChat, setCurrentChat] = useState(null); //for store chat that already exist
  const [privateChat, setPrivateChat] = useState([]);
  const [groupChat, setGroupChat] = useState([]);

  useEffect(() => {
    /* handle onclick put side */
    let handlerOutSide = (e) => {
      if (e.target.classList[1] === "uil-bars" && isAside) {
        setIsAside(false);
      } else if (!menuRef.current.contains(e.target)) {
        setIsAside(false);
      }
    };
    document.addEventListener("mousedown", handlerOutSide);

    return () => {
      document.removeEventListener("mousedown", handlerOutSide);
    };
  }, [isAside, setIsAside]);

  useEffect(() => {
    const getAllChat = async () => {
      try {
        const res = await axios.get(`${baseUri}conversations/${user._id}`);
        setPrivateChat(res?.data?.filter((conv) => conv.isGroup === false));
        setGroupChat(res?.data?.filter((conv) => conv.isGroup === true));
      } catch (err) {
        console.log(err);
      }
    };
    getAllChat();
  }, [baseUri, user, currentChat]);

  return (
    <div className="chat-app">
      <aside
        ref={menuRef}
        className={`chat-app-aside ${isToolBar && "low-visibility"}`}
      >
        <ChatAside
          setNewChat={setNewChat}
          isAside={isAside}
          setIsAside={setIsAside}
          setCurrentChat={setCurrentChat}
          currentChat={currentChat}
          openGroupForm={openGroupForm}
          setOpenGroupForm={setOpenGroupForm}
          privateChat={privateChat}
          setPrivateChat={setPrivateChat}
          groupChat={groupChat}
          setGroupChat={setGroupChat}
          isToolBar={isToolBar}
          setIsToolBar={setIsToolBar}
        />
      </aside>
      <main className={`chat-app-main`}>
        <ChatMain
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          newChat={newChat}
          setNewChat={setNewChat}
          openGroupForm={openGroupForm}
          setOpenGroupForm={setOpenGroupForm}
          privateChat={privateChat}
          setPrivateChat={setPrivateChat}
          groupChat={groupChat}
          setGroupChat={setGroupChat}
          isAside={isAside}
          isToolBar={isToolBar}
          setIsToolBar={setIsToolBar}
        />
        <ChatToolBar
          currentChat={currentChat}
          isToolBar={isToolBar}
          setIsToolBar={setIsToolBar}
          privateChat={privateChat}
          setPrivateChat={setPrivateChat}
          groupChat={groupChat}
          setGroupChat={setGroupChat}
          setCurrentChat={setCurrentChat}
        />
      </main>
    </div>
  );
};

export default Messenger;
