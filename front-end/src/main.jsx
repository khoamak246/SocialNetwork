import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./redux/Store.jsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={Store}>
      <Toaster position="top-center" reverseOrder={true} />
      <App />
    </Provider>
  </BrowserRouter>
  /* </React.StrictMode> */
);
