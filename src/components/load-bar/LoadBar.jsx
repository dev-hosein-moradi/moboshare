import React from "react";
import "./loadBar.css";

const LoadBar = () => {
  return (
    <div className="load__wrapper small">
      <span class="load__circle">
        <span class="load__circle inner"></span>
      </span>
    </div>
  );
};

export default LoadBar;
