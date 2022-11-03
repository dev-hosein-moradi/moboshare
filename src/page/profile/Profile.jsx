import React, { useContext, useEffect, useRef, useState } from "react";
import TopBar from "../../components/topBar/TopBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Feed from "../../components/feed/Feed";
import NavSwitchContent from "../../components/nav-switch-handler/NavSwitchContent";
import HomeSideBar from "../../components/home-sidebar/HomeSideBar";
import { Image } from "cloudinary-react";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const { user: currentUser } = useContext(AuthContext);

  const baseUri = process.env.REACT_APP_BASE_API;
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  let menuRef = useRef();
  const username = useParams().username;

  const [contentSwitch, setContentSwitch] = useState(3);
  const [isAside, setAside] = useState(false);

  /* get user */
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState(null);


  let width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const resize = () => {
    if (width >= 750) {
      setAside(false);
    }
  };
  
  useEffect(() => {
    window.onresize = resize;
    /* handle onclick put side */
    let handlerOutSide = (e) => {
      if (e.target.classList[1] === "uil-bars" && isAside) {
        setAside(false);
      } else if (!menuRef.current.contains(e.target)) {
        setAside(false);
      }
    };
    document.addEventListener("mousedown", handlerOutSide);
    /* get user info */
    const fetchUsers = async () => {
      const res = await axios.get(`${baseUri}users?username=${username}`);
      setUser(res.data);
    };
    fetchUsers();

    return () => {
      document.removeEventListener("mousedown", handlerOutSide);
    };
  }, [username, isAside, baseUri]);

  useEffect(() => {
    const updateAvatar = async () => {
      toast.loading("Updating", {
        duration: 4000,
        position: "top-left",
        style: {
          fontSize: "1.4rem",
          fontWeight: "500",
          fontFamily: "inherit",
          backgroundColor: "#b9e8ee",
        },
      });
      const userInfo = {
        userId: currentUser._id,
      };
      if (avatar) {
        const data = new FormData();
        const fileName = Date.now() + avatar.name;
        data.append("name", fileName);
        data.append("file", avatar);
        data.append("upload_preset", "yefgbqyx");
        try {
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/dclzpodah/image/upload`,
            data
          );
          userInfo.profilePicture = res?.data?.secure_url;
        } catch (err) {
          toast.error("cant upload cover picture.", {
            duration: 4000,
            position: "top-left",
            style: {
              fontSize: "1.4rem",
              fontWeight: "500",
              fontFamily: "inherit",
              backgroundColor: "#b9e8ee",
            },
          });
        }
      }

      try {
        const res = await axios.put(`${baseUri}users/${user?._id}`, userInfo);
        res.data && window.location.reload();
      } catch (err) {}
    };

    if (avatar) {
      updateAvatar();
    }
  }, [avatar, baseUri, currentUser._id, user]);

  return (
    <div className="home__container">
      <TopBar />
      <Toaster reverseOrder={false} />
      <div className="home">
        <nav className={`nav__aside__handler`}>
          <div className={`menu__toggle ${isAside ? "hide__bar" : null}`}>
            <button
              onClick={() => setAside(true)}
              className={`toggle__btn__menu`}
            >
              <span className="toggle__icon">
                <i className="fa-solid fa-bars"></i>
              </span>
              <span className="toggle__text">MENU</span>
            </button>
          </div>
          <NavSwitchContent
            contentSwitch={contentSwitch}
            setContentSwitch={setContentSwitch}
          />
        </nav>
        <aside
          ref={menuRef}
          className={`home__aside__menu ${isAside ? "openSide" : "closeSide"}`}
        >
          <HomeSideBar setAside={setAside} />
        </aside>
        <main className={`home__main__content ${isAside && "low__visibility"}`}>
          <header className="bg__header">
            <div className="cover__img">
              {user.coverPicture ? (
                <Image
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  className="img"
                  loading="lazy"
                  crossOrigin="anonymous"
                  cloudName="dclzpodah"
                  publicId={user.coverPicture}
                />
              ) : (
                <img
                  loading="lazy"
                  crossOrigin="anonymous"
                  src={PF + "person/noCover.png"}
                  alt="avatar"
                />
              )}
            </div>
            <div className="user__main__prof">
              <div>
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
                <span>
                  <label htmlFor="avatar">
                    <i className="fa-regular fa-pen-to-square"></i>
                    <p>change avatar</p>
                    <input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => setAvatar(e.target.files[0])}
                    />
                  </label>
                </span>
              </div>
              <h1>{user.username}</h1>
              <p>{user.desc}</p>
            </div>
          </header>
          {/* empty div */}
          <div className="fix-height-size"></div>
          <Feed contentSwitch={contentSwitch} username={username} profile />
        </main>
      </div>
    </div>
  );
};

export default Profile;
