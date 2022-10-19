import React from "react";
import "./navSwitchContent.css";

const NavSwitchContent = ({ contentSwitch, setContentSwitch }) => {
  return (
    <>
      <ul className="content__display__handler">
        <li
          className={`content__item ${
            contentSwitch === 1 ? "selected__item" : null
          }`}
          onClick={() => setContentSwitch(1)}
        >
          Onlines
          {contentSwitch === 1 && <i className="fa-solid fa-angle-down"></i>}
        </li>
        <li
          className={`content__item ${
            contentSwitch === 2 ? "selected__item" : null
          }`}
          onClick={() => setContentSwitch(2)}
        >
          Firends
          {contentSwitch === 2 && <i className="fa-solid fa-angle-down"></i>}
        </li>
        <li
          className={`content__item ${
            contentSwitch === 3 ? "selected__item" : null
          }`}
          onClick={() => setContentSwitch(3)}
        >
          Posts
          {contentSwitch === 3 && <i className="fa-solid fa-angle-down"></i>}
        </li>
      </ul>
    </>
  );
};

export default NavSwitchContent;
