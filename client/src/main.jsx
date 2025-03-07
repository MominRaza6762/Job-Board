import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BackEndApiProvider } from "./Contexts/BackEndApi.jsx";
import { JobsProvider } from "./Contexts/Jobs.jsx";
import { UserDataProvider } from "./Contexts/UserData.jsx";
import { ThemeProvider } from "./Contexts/Theme.jsx";
import "./assets/index.css";
import App from "./App.jsx";
import React, { useEffect } from "react";

// 🛠 Function jo error ko body me append karega
const appendLogToPage = (type, message, details = null) => {
  let logContainer = document.getElementById("log-container");

  if (!logContainer) {
    logContainer = document.createElement("div");
    logContainer.id = "log-container";
    document.body.appendChild(logContainer);

    // Styling
    logContainer.style.position = "fixed";
    logContainer.style.bottom = "10px";
    logContainer.style.left = "10px";
    logContainer.style.width = "60%";
    logContainer.style.maxHeight = "300px";
    logContainer.style.overflowY = "auto";
    logContainer.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    logContainer.style.color = "white";
    logContainer.style.padding = "10px";
    logContainer.style.borderRadius = "5px";
    logContainer.style.zIndex = "9999";
    logContainer.style.fontSize = "12px";
    logContainer.style.fontFamily = "monospace";
    logContainer.style.whiteSpace = "pre-wrap";
  }

  const logDiv = document.createElement("div");
  logDiv.style.marginBottom = "10px";
  logDiv.innerHTML = `<strong>[${type.toUpperCase()}]</strong> ${message}`;

  if (details) {
    const detailsDiv = document.createElement("div");
    detailsDiv.style.color = "gray";
    detailsDiv.style.fontSize = "10px";
    detailsDiv.innerText = details;
    logDiv.appendChild(detailsDiv);
  }

  if (type === "error") logDiv.style.color = "red";
  if (type === "warn") logDiv.style.color = "yellow";
  if (type === "log") logDiv.style.color = "lightgray";

  logContainer.appendChild(logDiv);
};

// 🛠 Global Error Logger
const GlobalLogger = ({ children }) => {
  useEffect(() => {
    // Console log override
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      appendLogToPage("log", args.join(" "));
      originalConsoleLog(...args);
    };

    // Console warn override
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      appendLogToPage("warn", args.join(" "));
      originalConsoleWarn(...args);
    };

    // Console error override
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(" ");
      let errorStack = args[0]?.stack || "";
      appendLogToPage("error", errorMessage, errorStack);
      originalConsoleError(...args);
    };

    // Global error handling
    window.onerror = (message, source, lineno, colno, error) => {
      const errorMsg = `${message} at ${source}:${lineno}:${colno}`;
      const errorStack = error?.stack || "No stack trace available";
      appendLogToPage("error", errorMsg, errorStack);
    };

    // Unhandled promise rejection handling
    window.addEventListener("unhandledrejection", (event) => {
      appendLogToPage("error", "Unhandled Promise Rejection:", event.reason?.stack || event.reason);
    });

    return () => {
      window.onerror = null;
      window.removeEventListener("unhandledrejection", () => {});
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
    };
  }, []);

  return <>{children}</>;
};

// 🛠 Fetch wrapper jo CORS errors properly handle karega
const fetchWithCorsHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Agar CORS error ho, yeh details extract karega
      const text = await response.text();
      appendLogToPage(
        "CORS ERROR",
        `Request to: ${url} failed with status ${response.status}`,
        `Response: ${text}`
      );
      throw new Error(`CORS Error: ${response.status} - ${text}`);
    }

    return response.json();
  } catch (error) {
    appendLogToPage("NETWORK ERROR", `Failed request to: ${url}`, error.message);
    throw error;
  }
};

// 🛠 GlobalLogger wrap karke render karna
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <JobsProvider>
        <BackEndApiProvider>
          <UserDataProvider>
            <GlobalLogger>
              <App fetchWithCorsHandling={fetchWithCorsHandling} />
            </GlobalLogger>
          </UserDataProvider>
        </BackEndApiProvider>
      </JobsProvider>
    </ThemeProvider>
  </BrowserRouter>
);
