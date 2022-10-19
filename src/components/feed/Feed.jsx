import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Users } from "../../dummyData";
import Share from "../Share";
import FriendCard from "../user-card/FriendCard";
import OnlineCard from "../user-card/OnlineCard";
import PostCard from "../post-card/PostCard";
import { Link } from "react-router-dom";

const Feed = ({ username, home, profile, contentSwitch }) => {
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const baseUri = process.env.REACT_APP_BASE_API;
  /* store posts */
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?.id)
  );

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${baseUri}users?username=${username}`);
      setUser(res.data);
    };
    fetchUsers();
  }, [baseUri, username]);

  useEffect(() => {
    /* get user info */
    // console.time("user");

    /* get posts from server */
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(baseUri + "posts/profile/" + username)
        : await axios.get(baseUri + "posts/timeline/" + currentUser._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
    /* get friend */

    const getFriend = async () => {
      try {
        if (user._id) {
          const friendList = await axios.get(
            `${baseUri}users/friends/${user._id}`
          );
          setFriends(friendList.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFriend();
  }, [user._id, currentUser._id, username, baseUri]);
  useEffect(() => {
    /* handle visual height */
    const handleHeight = () => {
      document.documentElement.style.setProperty(
        "--visual-height",
        `${visualViewport.height}px`
      );
    };
    window.onresize = handleHeight;
  }, []);

  /*  */
  const handleFollowClick = async () => {
    try {
      if (followed) {
        await axios.put(`${baseUri}users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`${baseUri}users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (err) {
      console.log(err);
    }
    setFollowed(!followed);
  };

  return (
    <section className="user__activity">
      <div className="user__data">
        {currentUser.username !== username && (
          <button
            className={`follow__btn ${
              followed ? "unFollow__btn__dark" : "followed__btn__blue"
            }`}
            onClick={handleFollowClick}
          >
            {followed ? "UnFollow" : "Follow"}
          </button>
        )}

        {user && profile ? (
          <div className="info">
            <span className="profile__info__header">
              <h2>User Information</h2>
              <Link to={`/profile/${currentUser?.username}/personalinfo`}>
                <button className="info__edit__btn">
                  <span>Edit Profile</span>
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
              </Link>
            </span>
            <div className="info__items">
              <span className="info__item">
                <h3>Full Name:</h3>
                <p>{user?.fullName}</p>
              </span>
              <span className="info__item">
                <h3>City:</h3>
                <p>{user?.city}</p>
              </span>
              <span className="info__item">
                <h3>From:</h3>
                <p>{user?.from}</p>
              </span>
              <span className="info__item">
                <h3>Relationship:</h3>
                <p>
                  {user?.relationship === 1
                    ? "Single"
                    : user?.relationship === 2
                    ? "Married"
                    : "-"}
                </p>
              </span>
            </div>
          </div>
        ) : null}
        <div
          className={`friends__data ${
            contentSwitch === 2 ? "show__friends" : "hide__friends"
          }`}
        >
          <h2>Friends</h2>
          <hr
            style={{
              width: "180px",
              margin: "1rem 0",
              border: "1px solid #b4b4b4",
            }}
          />
          <div className="friends">
            {friends.map((friend) => {
              return <FriendCard key={friend._id} friendData={friend} />;
            })}
          </div>
        </div>
        <div
          className={`online__friends ${
            contentSwitch === 1 ? "show__onlines" : "hide__onlines"
          }`}
        >
          <h2>Onlines</h2>
          <hr
            style={{
              width: "180px",
              margin: "1rem 0",
              border: "1px solid #b4b4b4",
            }}
          />
          <div className="onlines">
            {Users.map((user) => {
              return <OnlineCard key={user.id} userData={user} />;
            })}
          </div>
        </div>
      </div>
      <div
        className={`user__posts ${
          contentSwitch === 3 ? "show__posts" : "hide__posts"
        }`}
      >
        {(!username || currentUser.username === username) && <Share />}

        <div
          className={`posts ${
            contentSwitch === 3 ? "show__posts" : "hide__posts"
          }`}
        >
          {posts.map((post) => {
            return (
              <PostCard
                key={post._id}
                postData={post}
                posts={posts}
                setPosts={setPosts}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Feed;
