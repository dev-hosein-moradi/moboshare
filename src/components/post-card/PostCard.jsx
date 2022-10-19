import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./postCard.css";
import { Image } from "cloudinary-react";

const PostCard = ({ postData, posts, setPosts }) => {
  let animRef = useRef();

  const { user: currentUser } = useContext(AuthContext);
  const baseUri = process.env.REACT_APP_BASE_API;
  /* user env url to import photo path */
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  /* get user */
  const [user, setUser] = useState({});
  /* liske/disLike post */
  const [postMenu, setPostMenu] = useState(false);
  const [like, setLike] = useState(postData.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isCutDesc, setIsCutDesc] = useState(true);

  useEffect(() => {
    setIsLiked(postData.likes.includes(currentUser._id));
  }, [currentUser._id, postData.likes]);

  /* handler for like / disLike post */
  const likeHandler = () => {
    try {
      axios.put(`${baseUri}posts/${postData._id}/like`, {
        userId: currentUser._id,
      });
    } catch (error) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  const adjustDescription = () => {
    return postData
      ? isCutDesc
        ? postData.desc.substr(0, 100)
        : postData.desc
      : null;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${baseUri}users?userId=${postData.userId}`);
      setUser(res.data);
    };
    fetchUsers();
  }, [baseUri, postData.userId]);

  const removePost = async () => {
    setPostMenu(!postMenu);
    try {
      const res = await axios.delete(`${baseUri}posts/${postData?._id}`);
    } catch (err) {}
    setPosts(posts?.filter((p) => p._id !== postData._id));
  };

  return (
    <div className="post" ref={animRef}>
      <div className="post-header">
        <div className="header-info">
          <div className="info-img">
            <Link to={`profile/${user.username}`}>
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
            </Link>
          </div>
          <div className="info-username">
            <h3>{user.username}</h3>
          </div>
        </div>
        <div className="header-menu">
          <i
            onClick={() => setPostMenu(!postMenu)}
            className="fa-solid fa-ellipsis-vertical"
          ></i>
          <ul
            className={`menu-box ${
              postMenu ? "open__post__menu" : "close__post__menu"
            }`}
          >
            <li onClick={() => setPostMenu(!postMenu)}>
              <strong>Created at: </strong>
              {"  "}
              {DateTime.fromISO(postData?.createdAt).toFormat("f")}
            </li>
            {(postData.userId === currentUser._id || currentUser.isAdmin) && (
              <li onClick={removePost}>
                <span>
                  <i className="fa-solid fa-trash"></i>
                </span>
                Delete
              </li>
            )}
          </ul>
        </div>
      </div>
      {/* <hr
        style={{
          width: "90%",
          margin: ".5rem auto",
          border: "1px solid #EEEEEE",
        }}
      /> */}
      <div className="post-title">
        <p className="title">{adjustDescription()}</p>
        {isCutDesc && postData?.desc.length >= 101 ? (
          <p onClick={() => setIsCutDesc(false)} className="adjust-switch-more">
            ...show more
          </p>
        ) : null}
      </div>
      <div className="post-image">
        <Image
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="img"
          loading="lazy"
          crossOrigin="anonymous"
          cloudName="dclzpodah"
          publicId={postData?.img}
        />
      </div>
      <div className="post-footer">
        <div className="footer-like">
          <i
            onClick={likeHandler}
            className={`${isLiked ? "fa-solid" : "fa-regular"} fa-heart`}
          ></i>
          <p>{like}</p>
        </div>
        <div className="footer-comment">
          <i className="fa-regular fa-comment"></i>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
