// components import
import App from "./App.jsx";

// css import
import "./index.css";

// libraries import
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom"; // Better routing all over pages

ReactDOM.createRoot(document.getElementById("root")).render(
   <BrowserRouter>
      <App />
      <Toaster />
   </BrowserRouter>
);
