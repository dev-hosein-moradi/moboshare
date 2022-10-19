import React, { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";

const Auth = () => {
  const [haveAccount, setHaveAccount] = useState(false);
  
  

  return (
    <div className="auth-container">
      {haveAccount ? (
        <Login
          setHaveAccount={setHaveAccount}
        />
      ) : (
        <Register
          setHaveAccount={setHaveAccount}
        />
      )}
    </div>
  );
};

export default Auth;

//login page:
/*
1- defaine fully semantic html structure with aproprate tag.
2- each input box should have label, icon, and security pattern with reqular expression. and  aria-describedby.
3- add custom style to input for handle error and describe required and rule. and use border color for this.
4- add required guid text under input.
5- add toogler for change theme of app.
6- 



*/
