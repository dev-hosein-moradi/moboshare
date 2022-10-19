import React, { useState } from "react";
import "./startGuid.css";
import marketing1 from "../../svg/market1.svg";
import marketing2 from "../../svg/market2.svg";
import daily from "../../svg/daily.svg";
import { useNavigate } from "react-router";

const StartGuid = () => {
  let navigate = useNavigate();
  const guids = [
    {
      id: 1,
      title: "Online Business",
      text: "You can expand your business with Moboshare. helps your business to be seen a lot",
      image1: marketing1,
      image2: marketing2,
    },
    {
      id: 3,
      title: "Sharing your daily life",
      text: "You can share your daily life with others and get feedback from others by using Moboshare sharing service. And be aware of other events by following other people.",
      image1: daily,
    },
  ];
  const [counter, setCounter] = useState(0);

  const handleAnimation = () => {
    if (counter === 1) {
      navigate("/");
    } else {
      setCounter(counter + 1);
    }
  };

  return (
    <div className="guid__container">
      <div key={guids[counter]?.id} className={`guid__box`}>
        <img className={`box__img1 `} src={guids[counter]?.image1} alt="" />
        <div className={`guid__text`}>
          <h1 className="box__title">{guids[counter]?.title}</h1>
          <p className="box__desc">{guids[counter]?.text}</p>
        </div>
        {counter !== 1 && (
          <img
            className="box__img2"
            src={guids[counter]?.image2 ? guids[counter]?.image2 : null}
            alt=""
          />
        )}
      </div>
      <div className={`guid__counter`}>
        <div className={`circle__box ${counter === 0 && "circle1"}`}></div>
        <div className={`circle__box ${counter === 1 && "circle2"}`}></div>
      </div>
      <div className={`guid__cta`}>
        <button onClick={handleAnimation} className="cta__btn">
          <span>{counter === 1 ? "Lets Go!" : "Next"}</span>
          {counter !== 1 && <i className="fa-solid fa-arrow-right"></i>}
        </button>
      </div>
    </div>
  );
};

export default StartGuid;
