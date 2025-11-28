import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Loader from "./components/Loader";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider>
        <App />
            <Loader />
        </ThemeProvider>
  </React.StrictMode>
);
