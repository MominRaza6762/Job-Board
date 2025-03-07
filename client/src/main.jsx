import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BackEndApiProvider } from "./Contexts/BackEndApi.jsx";
import { JobsProvider } from "./Contexts/Jobs.jsx";
import { UserDataProvider } from "./Contexts/UserData.jsx";
import { ThemeProvider } from "./Contexts/Theme.jsx";
import "./assets/index.css";
import App from "./App.jsx";
import { useState, useEffect } from "react";
import React from "react";

const ErrorHandler = ({ children }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      setError(`Error: ${message} at ${source}:${lineno}:${colno}`);
    };

    window.addEventListener("unhandledrejection", (event) => {
      setError(`Unhandled Promise Rejection: ${event.reason}`);
    });

    return () => {
      window.onerror = null;
      window.removeEventListener("unhandledrejection", () => {});
    };
  }, []);

  return (
    <div>
      {error && <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>}
      {children}
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <JobsProvider>
        <BackEndApiProvider>
          <UserDataProvider>
            <ErrorHandler>
              <App />
            </ErrorHandler>
          </UserDataProvider>
        </BackEndApiProvider>
      </JobsProvider>
    </ThemeProvider>
  </BrowserRouter>
);
