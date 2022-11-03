import React, { useContext, useEffect, useReducer, useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { registerCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import LoadBar from "../../components/load-bar/LoadBar";

//username reducer
const usernameReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    let isValidFormat =
      !action.val.includes("@") &&
      !action.val.includes("#") &&
      !action.val.includes("#") &&
      !action.val.includes("*") &&
      action.val.length >= 5;
    return { value: action.val, isValid: isValidFormat };
  }
  if (action.type === "INPUT_BLUR") {
    let isValidFormat =
      !state.value.includes("@") &&
      !state.value.includes("#") &&
      !state.value.includes("#") &&
      !state.value.includes("*") &&
      state.value.length >= 5;
    return { value: state.value, isValid: isValidFormat };
  }
  return { value: "", isValid: false };
};

//email reducer
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

//password reducer
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length >= 8 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length >= 8 };
  }
  return { value: "", isValid: false };
};

//confirm password reducer
const confirmPasswordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return {
      value: action.val,
      isValid: action.val.trim().length >= 8,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim().length >= 8,
    };
  }
  if (action.type === "INPUT_INVALID") {
    return { value: state.value, isValid: false };
  }
  return { value: "", isValid: false };
};

const Register = () => {
  const navigate = useNavigate();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user, isFetching, error, errorTxt, dispatch } =
    useContext(AuthContext);

  const [passVisib, setPassVisib] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* register form state */
  const [usernameState, dispatchUsername] = useReducer(usernameReducer, {
    value: "",
    isValid: null,
  });

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const [confirmPasswordState, dispatchConfirmPassword] = useReducer(
    confirmPasswordReducer,
    {
      value: "",
      isValid: null,
    }
  );

  const [fullName, setFullName] = useState("");
  // profile picture
  const [file, setFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  /* register form error state */
  const [errors, setErrors] = useState({
    usernameErr: "",
    emailErr: "",
    passwordErr: "",
    passwordAgainErr: "",
  });

  // change and validate handler for username input
  const usernameChangeHandler = (e) => {
    dispatchUsername({ type: "USER_INPUT", val: e.target.value });
    setErrors((state) => {
      return {
        ...state,
        usernameErr: "",
      };
    });
  };
  const validateUsernameHandler = () => {
    dispatchUsername({ type: "INPUT_BLUR" });
    // handle invalid format error of username input
    if (!usernameState.isValid && usernameState.value) {
      setErrors((state) => {
        return {
          ...state,
          usernameErr: "enter correct format! at least 5 character",
        };
      });
    }
  };

  // change and validate handler for email input
  const emailChangeHandler = (e) => {
    dispatchEmail({ type: "USER_INPUT", val: e.target.value });
    setErrors((state) => {
      return {
        ...state,
        emailErr: "",
      };
    });
  };
  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
    // handle invalid format error of email input
    if (!emailState.isValid && emailState.value) {
      setErrors((state) => {
        return {
          ...state,
          emailErr: "enter correct format! e.g (hosein@gmail.com)",
        };
      });
    }
  };

  // change and validate handler for password input
  const passwordChangeHandler = (e) => {
    dispatchPassword({ type: "USER_INPUT", val: e.target.value });
    setErrors((state) => {
      return {
        ...state,
        passwordErr: "",
      };
    });
  };
  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
    // handle invalid format error of password input
    if (!passwordState.isValid && passwordState.value) {
      setErrors((state) => {
        return {
          ...state,
          passwordErr: "enter correct format! without space.",
        };
      });
    }
  };

  // change and validate handler for confirm password input
  const confirmPasswordChangeHandler = (e) => {
    dispatchConfirmPassword({ type: "USER_INPUT", val: e.target.value });
    setErrors((state) => {
      return {
        ...state,
        passwordErr: "",
      };
    });
  };
  const validateConfirmPasswordHandler = () => {
    dispatchConfirmPassword({ type: "INPUT_BLUR" });
    // handle invalid format error of password input
    if (!passwordState.isValid && passwordState.value) {
      setErrors((state) => {
        return {
          ...state,
          passwordErr: "enter correct format! without space.",
        };
      });
    }
    if (
      confirmPasswordState.value &&
      passwordState.value &&
      passwordState.value !== confirmPasswordState.value
    ) {
      dispatchConfirmPassword({ type: "INPUT_INVALID" });
      setErrors((state) => {
        return {
          ...state,
          passwordAgainErr: "password repetition does not match!",
        };
      });
    } else {
      setErrors((state) => {
        return {
          ...state,
          passwordAgainErr: "",
        };
      });
    }
  };

  //check form validate
  const { isValid: usernameIsValid } = usernameState;
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;
  const { value: passwordValue } = passwordState;
  const { value: confirmPasswordValue } = confirmPasswordState;
  useEffect(() => {
    const identifier = setTimeout(() => {
      // set status of form validate
      setIsFormValid(emailIsValid && passwordIsValid && usernameIsValid);
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [
    confirmPasswordState.value,
    confirmPasswordValue,
    emailIsValid,
    emailState.isValid,
    passwordIsValid,
    passwordState.isValid,
    passwordState.value,
    passwordValue,
    usernameIsValid,
    usernameState.isValid,
  ]);

  // handler for send signup request to server if form is valid
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setErrors({
      usernameErr: "",
      emailErr: "",
      passwordErr: "",
      passwordAgainErr: "",
    });
    if (isFormValid) {
      setIsLoading(true);
      const user = {
        username: usernameState.value,
        email: emailState.value,
        password: passwordState.value,
        fullName: fullName,
      };
      // if user select profile
      if (file) {
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
          user.profilePicture = res?.data?.secure_url;
          if (!res.data || res.status === 500) {
            toast.error("failed to upload image! try again", {
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
        } catch (err) {
          toast.error(
            "cant upload image, please remove your profile picture.",
            {
              duration: 4000,
              position: "top-left",
              style: {
                fontSize: "1.4rem",
                fontWeight: "500",
                fontFamily: "inherit",
                backgroundColor: "#b9e8ee",
              },
            }
          );
        }
      }
      registerCall(user, dispatch);
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(errorTxt.substring(0, 100) + " (activate your V.P.N)", {
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
  }, [user, error, errorTxt, isFetching]);

  const handlerSwitchForm = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <section className="register">
      <Toaster reverseOrder={false} />
      <div className="register__auther">
        <h1>MoboShare</h1>
        <div className="auther__description">
          <h6>Please activate your V.P.N</h6>
          <p>
            Moboshare is a social platform for communication and online
            business. You can expand your relationship and business with us.
          </p>
        </div>
        <div className="auther__links">
          <a
            href="https://www.linkedin.com/in/hosein-moradi-4a3251232/"
            target="_blank"
            rel="noreferrer"
            className="links__iconbox linkedin"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a
            href="https://www.instagram.com/_.ho3ein.mo/"
            target="_blank"
            rel="noreferrer"
            className="links__iconbox instagram"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://github.com/dev-hosein-moradi"
            target="_blank"
            rel="noreferrer"
            className="links__iconbox github"
          >
            <i className="fa-brands fa-github"></i>
          </a>
          <a
            href="https://t.me/M_hosein7"
            target="_blank"
            rel="noreferrer"
            className="links__iconbox telegram"
          >
            <i className="fa-brands fa-telegram"></i>
          </a>
        </div>
      </div>
      <form className="register__form">
        <div className="form__inputs">
          {/* username */}
          <div className={`inputs__item username`}>
            <label htmlFor="username">
              Enter username <p>*</p>
            </label>
            <div
              className={`${
                usernameState.isValid !== null
                  ? usernameState.isValid
                    ? "valid"
                    : "invalid"
                  : null
              }`}
            >
              <i className="fa-regular fa-user"></i>
              <input
                id="username"
                type="text"
                name="username"
                aria-describedby="username"
                pattern="[a-zA-z0-9]"
                title="Letters and numbers without spaces"
                spellCheck="false"
                required
                min="5"
                value={usernameState.value}
                onChange={usernameChangeHandler}
                onBlur={validateUsernameHandler}
              />
            </div>
            {/* error text */}
            <p>{errors.usernameErr}</p>
          </div>

          {/* email */}
          <div className="inputs__item email">
            <label htmlFor="email">
              Enter email <p>*</p>
            </label>
            <div
              className={`${
                emailState.isValid !== null
                  ? emailState.isValid
                    ? "valid"
                    : "invalid"
                  : null
              }`}
            >
              <i className="fa-regular fa-envelope"></i>
              <input
                id="email"
                type="email"
                name="email"
                aria-describedby="email"
                title="example: test@gmail.com"
                spellCheck="false"
                required
                value={emailState.value}
                onChange={emailChangeHandler}
                onBlur={validateEmailHandler}
              />
            </div>
            {/* error text */}
            <p>{errors.emailErr}</p>
          </div>

          {/* password */}
          <div className="inputs__item password">
            <label htmlFor="password">
              Enter password <p>*</p>
            </label>
            <div
              className={`${
                passwordState.isValid !== null
                  ? passwordState.isValid
                    ? "valid"
                    : "invalid"
                  : null
              }`}
            >
              <i className="fa-solid fa-lock"></i>
              <input
                id="password"
                type={`${passVisib ? "text" : "password"}`}
                name="password"
                aria-describedby="password"
                pattern="[a-zA-z0-9]"
                title="dont use symbol! "
                spellCheck="false"
                required
                min="8"
                value={passwordState.value}
                onChange={passwordChangeHandler}
                onBlur={validatePasswordHandler}
              />
              <i
                onClick={() => setPassVisib(!passVisib)}
                className={`fa-regular ${
                  passVisib ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </div>
            {/* error text */}
            <p>
              {passwordState.value
                ? errors.passwordErr
                : "at least 8 character (letter, number)"}
            </p>
          </div>

          {/* confirm password */}
          <div className="inputs__item confirmPassword">
            <label htmlFor="confirmPassword">
              confirm password <p>*</p>
            </label>
            <div
              className={`${
                confirmPasswordState.isValid !== null
                  ? confirmPasswordState.isValid
                    ? "valid"
                    : "invalid"
                  : null
              }`}
            >
              <i className="fa-solid fa-lock"></i>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                aria-describedby="confirmPassword"
                pattern="[a-zA-z0-9]"
                title="dont use symbol!"
                spellCheck="false"
                required
                min="8"
                value={confirmPasswordState.value}
                onChange={confirmPasswordChangeHandler}
                onBlur={validateConfirmPasswordHandler}
              />
            </div>
            {/* error text */}
            <p>{errors.passwordAgainErr}</p>
          </div>

          {/* full name */}
          <div className="inputs__item fullname">
            <label htmlFor="fullname">Enter full name</label>
            <div>
              <input
                id="fullname"
                type="text"
                name="fullName"
                aria-describedby="fullName"
                spellCheck="false"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {/* error text */}
            <p></p>
          </div>
        </div>
        <div className="form__profile-picture">
          <div className="profile__selection">
            {file && (
              <button className="remove__image" onClick={() => setFile(null)}>
                <span className="circle__remove" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button__text">Remove</span>
              </button>
            )}
            {!file && (
              <label htmlFor="file">
                <i className="fa-solid fa-upload"></i>
                <p>select profile image</p>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            )}
          </div>
          <div className="profile__preview">
            <div className="preview__img">
              <img
                alt="user"
                src={
                  file ? URL.createObjectURL(file) : PF + "person/noAvatar.png"
                }
              />
            </div>
          </div>
        </div>
        <div className="form__btns">
          <button
            disabled={!isFormValid && !isLoading}
            type="submit"
            onClick={handleRegisterUser}
          >
            {isLoading ? <LoadBar /> : "Signup"}
          </button>
          <button onClick={handlerSwitchForm}>Already have an account?</button>
        </div>
      </form>
    </section>
  );
};

export default Register;
