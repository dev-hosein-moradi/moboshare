import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);

/* 
REACT_APP_PUBLIC_FOLDER=https://moboshare-server.herokuapp.com/images/
REACT_APP_BASE_API=https://moboshare-server.herokuapp.com/api/
*/

/* 
REACT_APP_PUBLIC_FOLDER=http://localhost:4000/images/
REACT_APP_BASE_API=http://localhost:4000/api/
*/
