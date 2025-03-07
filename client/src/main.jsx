import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BackEndApiProvider } from "./Contexts/BackEndApi.jsx";
import { JobsProvider } from "./Contexts/Jobs.jsx";
import { UserDataProvider } from "./Contexts/UserData.jsx";
import { ThemeProvider } from "./Contexts/Theme.jsx";
import "./assets/index.css";
import App from "./App.jsx";
import React, { useEffect } from "react";

const showErrorOnPage = (message) => {
  // Agar error div pehle se hai, use update karo
  let errorDiv = document.getElementById("global-error-div");
  if (!errorDiv) {
    // Naya div create karo agar pehle nahi hai
    errorDiv = document.createElement("div");
    errorDiv.id = "global-error-div";
    document.body.appendChild(errorDiv);
  }

  // Error ko show karne ka style
  errorDiv.innerText = message;
  errorDiv.style.position = "fixed";
  errorDiv.style.bottom = "10px";
  errorDiv.style.left = "10px";
  errorDiv.style.backgroundColor = "red";
  errorDiv.style.color = "white";
  errorDiv.style.padding = "10px";
  errorDiv.style.borderRadius = "5px";
  errorDiv.style.fontWeight = "bold";
  errorDiv.style.zIndex = "9999";
};

const GlobalErrorHandler = ({ children }) => {
  useEffect(() => {
    const handleError = (message, source, lineno, colno, error) => {
      const errorMsg = `Error: ${message} at ${source}:${lineno}:${colno}`;
      console.error(errorMsg);
      showErrorOnPage(errorMsg);
    };

    const handlePromiseRejection = (event) => {
      console.error("Unhandled Promise Rejection:", event.reason);
      showErrorOnPage(`Unhandled Promise Rejection: ${event.reason}`);
    };

    // 🛠 API Errors handle karne ke liye
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        return response;
      } catch (error) {
        console.error("API Error:", error);
        showErrorOnPage(`API Error: ${error.message}`);
        throw error;
      }
    };

    window.onerror = handleError;
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.onerror = null;
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
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
