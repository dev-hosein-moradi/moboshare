import React, { useContext, useEffect, useRef, useState } from "react";
import "./home.css";
import TopBar from "../../components/topBar/TopBar";
import { AuthContext } from "../../context/AuthContext";
import Feed from "../../components/feed/Feed";
import NavSwitchContent from "../../components/nav-switch-handler/NavSwitchContent";
import HomeSideBar from "../../components/home-sidebar/HomeSideBar";

const Home = ({ username }) => {
  let menuRef = useRef();
  const { user } = useContext(AuthContext);
  const [contentSwitch, setContentSwitch] = useState(3);

  const [isAside, setAside] = useState(false);

  useEffect(() => {
    /* handle onclick put side */
    let handlerOutSide = (e) => {
      if (e.target.classList[1] === "uil-bars" && isAside) {
        setAside(false);
      } else if (!menuRef.current.contains(e.target)) {
        setAside(false);
      }
    };
    document.addEventListener("mousedown", handlerOutSide);

    return () => {
      document.removeEventListener("mousedown", handlerOutSide);
    };
  }, [isAside]);
  useEffect(() => {
    /* handle visual height */
    const handleHeight = () => {
      document.documentElement.style.setProperty(
        "--visual-height",
        `${visualViewport.height}px`
      );
      let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (width >= 750) {
        setAside(false);
      }
      if (width >= 1024) {
      }
    };
    window.onresize = handleHeight;
    if (
      window.innerWidth >= 1024 ||
      document.documentElement.clientWidth >= 1024 ||
      document.body.clientWidth >= 1024
    ) {
      console.log("hast");
      setContentSwitch(4);
    }
  }, []);

  return (
    <div className="home__container">
      <TopBar />
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
          <Feed username={user?.username} contentSwitch={contentSwitch} home />
        </main>
      </div>
    </div>
  );
};

export default Home;
