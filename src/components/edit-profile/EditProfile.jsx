import axios from "axios";
import { Image } from "cloudinary-react";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoadBar from "../load-bar/LoadBar";
import "./editProfile.css";

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const baseUri = process.env.REACT_APP_BASE_API;
  const navigate = useNavigate();

  /* states */
  const [currentUser, setCurrentUser] = useState(null);

  const [coverFile, setCoverFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [relationship, setRelationShip] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${baseUri}users?userId=${user?._id}`);
        setCurrentUser(res.data);
        setFullName(res?.data?.fullName);
        setCity(res?.data?.city);
        setBio(res?.data?.desc);
        setPlaceOfBirth(res?.data?.from);
        setRelationShip(res?.data?.relationship);
      } catch (err) {}
    };
    getUser();
  }, [baseUri, user]);

  const onUpdateInfoHandler = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    let turnReq = false;
    const userInfo = {
      userId: user._id,
      fullName: fullName ? fullName : currentUser?.fullName,
      city: city ? city : currentUser?.city,
      desc: bio ? bio : currentUser?.desc,
      from: placeOfBirth ? placeOfBirth : currentUser?.from,
      relationship: relationship
        ? Number(relationship)
        : currentUser?.relationship,
    };
    if (coverFile) {
      const data = new FormData();
      const fileName = Date.now() + coverFile.name;
      data.append("name", fileName);
      data.append("file", coverFile);
      data.append("upload_preset", "yefgbqyx");
      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dclzpodah/image/upload`,
          data
        );
        userInfo.coverPicture = res?.data?.secure_url;
        turnReq = true;
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
    } else {
      turnReq = true;
    }
    if (turnReq) {
      try {
        const res = await axios.put(`${baseUri}users/${user._id}`, userInfo);
        setUpdateLoading(false);
        toast(res.data, {
          duration: 2000,
          position: "top-left",
          style: {
            fontSize: "1.4rem",
            fontWeight: "500",
            fontFamily: "inherit",
            backgroundColor: "#b9e8ee",
          },
        });
        if (res.status === 200) {
          setTimeout(() => {
            navigate(`/profile/${user.username}`);
          }, 2500);
        }
      } catch (err) {
        toast.error("cant update your information.", {
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
  };

  const discardChangeHandler = (e) => {
    e.preventDefault();
    navigate(`/profile/${user.username}`);
  };

  return (
    <div className="editProfile__container">
      <Toaster reverseOrder={false} />
      <header className="editProfile__header">
        <div className="header__cover">
          {currentUser?.coverPicture ? (
            <Image
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="img"
              loading="lazy"
              crossOrigin="anonymous"
              cloudName="dclzpodah"
              publicId={currentUser.coverPicture}
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
        <div className="header__avatar">
          <div className="avatar__image">
            {currentUser?.profilePicture ? (
              <Image
                style={{ objectFit: "cover", objectPosition: "center" }}
                className="img"
                loading="lazy"
                crossOrigin="anonymous"
                cloudName="dclzpodah"
                publicId={currentUser.profilePicture}
              />
            ) : (
              <img
                loading="lazy"
                crossOrigin="anonymous"
                src={PF + "person/noAvatar.png"}
                alt="avatar"
              />
            )}
          </div>
          <div className="avatar__name">
            <h1>{user.username}</h1>
            <p>{user.desc}</p>
          </div>
        </div>
      </header>
      {/* <hr style={{ width: "90%", margin: "1rem auto" }} /> */}
      <main className="editProfile__main">
        <form className="edit__form">
          <h1>User Information</h1>
          {/* box1 */}
          <div className="edit__content">
            {/* cover input box */}
            <div className="edit__cover__box">
              <label htmlFor="cover" className="cover__label box__label">
                <div>
                  <p>Chagne Cover</p>
                </div>
                <input
                  id="cover"
                  name="cover"
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                />
              </label>

              <span className="cover__preview">
                {coverFile && (
                  <img
                    loading="lazy"
                    src={URL.createObjectURL(coverFile)}
                    alt=""
                  />
                )}
              </span>
            </div>
          </div>

          <div className="edit__content">
            {/* fullname input box */}
            <div className="edit__fullname__box inputs">
              <label htmlFor="fullname">Enter full name:</label>
              <input
                id="fullname"
                type="text"
                name="fullname"
                max="20"
                spellCheck="false"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {/* city input box */}
            <div className="edit__city__box inputs">
              <label htmlFor="city">Enter city name:</label>
              <input
                id="city"
                type="text"
                name="city"
                max="20"
                spellCheck="false"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            {/* bio input box */}
            <div className="edit__bio__box inputs">
              <label htmlFor="bio">bio:</label>
              <input
                id="bio"
                type="text"
                name="bio"
                max="30"
                spellCheck="false"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="edit__content">
            {/* from input box */}
            <div className="edit__place-of-birth__box inputs">
              <label htmlFor="placeOfBirth">Enter place of birth:</label>
              <input
                id="placeOfBirth"
                type="text"
                name="placeOfBirth"
                spellCheck="false"
                max="20"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
              />
            </div>
            {/* relationship input box */}
            <div className="edit__relationship__box inputs checkbox__group">
              <label>Relationship status:</label>
              <span>
                <article>
                  <input
                    id="single"
                    type="radio"
                    name="relationship"
                    value="1"
                    onChange={(e) => setRelationShip(e.target.value)}
                  />
                  <label htmlFor="single">Single</label>
                </article>

                <article>
                  <input
                    id="married"
                    type="radio"
                    name="relationship"
                    value="2"
                    onChange={(e) => setRelationShip(e.target.value)}
                  />
                  <label htmlFor="married">Married</label>
                </article>

                <article>
                  <input
                    id="none"
                    type="radio"
                    name="relationship"
                    value="3"
                    onChange={(e) => setRelationShip("3")}
                  />
                  <label htmlFor="none">None</label>
                </article>
              </span>
            </div>
          </div>
          <div className="edit__form__btns">
            <button onClick={discardChangeHandler} disabled={updateLoading}>
              Discard
            </button>
            <button onClick={onUpdateInfoHandler} disabled={updateLoading}>
              {updateLoading ? <LoadBar /> : "Save"}
            </button>
          </div>
        </form>
      </main>
      <footer className="editProfile__footer"></footer>
    </div>
  );
};

export default EditProfile;
