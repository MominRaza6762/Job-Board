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

const GlobalErrorHandler = ({ children }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    const handleError = (message, source, lineno, colno, error) => {
      const errorMsg = `Error: ${message} at ${source}:${lineno}:${colno}`;
      console.error(errorMsg);
      setError(errorMsg);
    };

    const handlePromiseRejection = (event) => {
      console.error("Unhandled Promise Rejection:", event.reason);
      setError(`Unhandled Promise Rejection: ${event.reason}`);
    };

    window.onerror = handleError;
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.onerror = null;
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);

  return (
    <div>
      {error && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            left: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontWeight: "bold",
            zIndex: 9999,
          }}
        >
          {error}
        </div>
      )}
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
            <GlobalErrorHandler>
              <App />
            </GlobalErrorHandler>
          </UserDataProvider>
        </BackEndApiProvider>
      </JobsProvider>
    </ThemeProvider>
  </BrowserRouter>
);
