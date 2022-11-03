import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  const [haveAccount, setHaveAccount] = useState(false);

  return (
    <div className="auth-container">
      {haveAccount ? (
        <Login setHaveAccount={setHaveAccount} />
      ) : (
        <Register setHaveAccount={setHaveAccount} />
      )}
    </div>
  );
};

export default Auth;