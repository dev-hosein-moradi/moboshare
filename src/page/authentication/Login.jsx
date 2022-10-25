import React, { useContext, useEffect, useReducer, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginCall } from "../../apiCalls";
import LoadBar from "../../components/load-bar/LoadBar";
import { AuthContext } from "../../context/AuthContext";

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

const Login = () => {
  const navigate = useNavigate();
  const { user, isFetching, error, errorTxt, dispatch } =
    useContext(AuthContext);

  const [passVisib, setPassVisib] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* register form state */
  const [usernameState, dispatchUsername] = useReducer(usernameReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const [errors, setErrors] = useState({
    usernameErr: "",
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

  const { isValid: usernameIsValid } = usernameState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      // set status of form validate
      setIsFormValid(usernameIsValid && passwordIsValid);
    }, 500);
    return () => {
      clearTimeout(identifier);
    };
  }, [
    passwordIsValid,
    passwordState.isValid,
    passwordState.value,
    usernameIsValid,
  ]);

  const handleLoginUser = (e) => {
    e.preventDefault();
    setErrors({
      usernameErr: "",
    });
    if (isFormValid) {
      setIsLoading(true);
      const user = {
        username: usernameState.value,
        password: passwordState.value,
      };
      loginCall(user, dispatch);
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(errorTxt, {
        duration: 4000,
        position: "top-left",
        style: {
          fontSize: "1.4rem",
          fontWeight: "500",
          fontFamily: "inherit",
          backgroundColor: "#b9e8ee",
        },
      });
      setIsLoading(false);
    }
  }, [user, error, errorTxt, isFetching]);

  const handlerSwitchForm = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <section className="login">
      <Toaster reverseOrder={false} />
      <div className="login__auther">
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
            href="https://github.com/hosein7379m"
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
      <form className="login__form">
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
              {/* <i class="fa-regular fa-eye-slash"></i> */}
            </div>
            {/* error text */}
            <p>
              {passwordState.value
                ? errors.passwordErr
                : "at least 8 character (letter, number)"}
            </p>
          </div>
        </div>
        <div className="form__btns">
          <button
            disabled={!isFormValid && !isLoading}
            type="submit"
            onClick={handleLoginUser}
          >
            {isLoading ? <LoadBar /> : "LOGIN"}
          </button>
          <button onClick={handlerSwitchForm}>Create new account</button>
        </div>
      </form>
    </section>
  );
};

export default Login;
