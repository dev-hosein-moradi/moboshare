import React, { Fragment, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../page/home/home.css";
import axios from "axios";
import { Image } from "cloudinary-react";
import LoadBar from "./load-bar/LoadBar";
import toast, { Toaster } from "react-hot-toast";

const Share = () => {
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const baseUri = process.env.REACT_APP_BASE_API;
  const { user } = useContext(AuthContext);

  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitNewPost = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc,
    };
    if (file) {
      setIsLoading(true);

      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      data.append("upload_preset", "yefgbqyx");

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dclzpodah/image/upload`,
          data
        );
        newPost.img = res?.data?.secure_url;
      } catch (err) {
        toast.error("Failed to upload image, try again!", {
          duration: 3000,
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
      toast.error("you should select image!", {
        duration: 3000,
        position: "top-left",
        style: {
          fontSize: "1.4rem",
          fontWeight: "500",
          fontFamily: "inherit",
          backgroundColor: "#b9e8ee",
        },
      });
    }
    if (file) {
      try {
        const res = await axios.post(`${baseUri}posts`, newPost);
        res?.data && setIsLoading(false);
        toast.success("New post successfully uploaded.", {
          duration: 3000,
          position: "top-left",
          style: {
            fontSize: "1.4rem",
            fontWeight: "500",
            fontFamily: "inherit",
            backgroundColor: "#b9e8ee",
          },
        });
        window.location.reload();
      } catch (error) {
        toast.error("Failed to create post, try again later!", {
          duration: 3000,
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
  return (
    <Fragment>
      <Toaster reverseOrder={false} />
      <form className="create__post" onSubmit={submitNewPost}>
        <div className="create__title">
          <div className="title__img">
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
          </div>
          <div className="title__text">
            <input
              type="text"
              name="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={`whats in your mind ${user.username}?`}
              autoComplete="off"
              spellCheck="false"
              min="0"
              max="200"
            />
          </div>
        </div>
       
        {file && (
          <div className="preview__selected__img">
            <img loading="lazy" src={URL.createObjectURL(file)} alt="" />
            <button
              className="preview__img__remove"
              onClick={() => setFile(null)}
            >
              <span>
                <i className="fa-solid fa-xmark"></i>
              </span>
              remove
            </button>
          </div>
        )}
        <div className="create__feature__post">
          {!file && (
            <label htmlFor="file" className="create__img">
              <i className="fa-solid fa-upload"></i>
              <p>Photo</p>
              <input
                id="file"
                name="file"
                type="file"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          )}

          <div className="create__tag">
            <i className="fa-solid fa-tag"></i>
            <p>Tag</p>
          </div>
          <div className="create__location">
            <i className="fa-solid fa-location-dot"></i>
            <p>Location</p>
          </div>
        </div>
        <div className="add__btn">
          <button type="submit" disabled={isLoading}>
            {isLoading ? <LoadBar /> : "Add +"}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default Share;
