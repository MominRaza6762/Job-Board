import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BackEndApiProvider } from "./Contexts/BackEndApi.jsx";
import { JobsProvider } from "./Contexts/Jobs.jsx";
import { UserDataProvider } from "./Contexts/UserData.jsx";
import { ThemeProvider } from "./Contexts/Theme.jsx";
import "./assets/index.css";
import App from "./App.jsx";
import React, { useEffect } from "react";

// 🛠 Function jo errors ko body me append karega
const appendLogToPage = (type, message, stack = null) => {
  let logContainer = document.getElementById("log-container");

  if (!logContainer) {
    logContainer = document.createElement("div");
    logContainer.id = "log-container";
    document.body.appendChild(logContainer);

    // Style for logs
    logContainer.style.position = "fixed";
    logContainer.style.bottom = "10px";
    logContainer.style.left = "10px";
    logContainer.style.width = "50%";
    logContainer.style.maxHeight = "250px";
    logContainer.style.overflowY = "auto";
    logContainer.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    logContainer.style.color = "white";
    logContainer.style.padding = "10px";
    logContainer.style.borderRadius = "5px";
    logContainer.style.zIndex = "9999";
    logContainer.style.fontSize = "12px";
    logContainer.style.fontFamily = "monospace";
    logContainer.style.whiteSpace = "pre-wrap"; // 🔹 Error message wrap hoga
  }

  const logDiv = document.createElement("div");
  logDiv.style.marginBottom = "10px";

  logDiv.innerHTML = `<strong>[${type.toUpperCase()}]</strong> ${message}`;

  if (stack) {
    const stackDiv = document.createElement("div");
    stackDiv.style.color = "gray";
    stackDiv.style.fontSize = "10px";
    stackDiv.innerText = stack;
    logDiv.appendChild(stackDiv);
  }

  if (type === "error") logDiv.style.color = "red";
  if (type === "warn") logDiv.style.color = "yellow";
  if (type === "log") logDiv.style.color = "lightgray";

  logContainer.appendChild(logDiv);
};

// 🛠 Global Error Handling Component
const GlobalLogger = ({ children }) => {
  useEffect(() => {
    // Console logs capture karna
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      appendLogToPage("log", args.join(" "));
      originalConsoleLog(...args);
    };

    // Console warnings capture karna
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      appendLogToPage("warn", args.join(" "));
      originalConsoleWarn(...args);
    };

    // Console errors capture karna
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(" ");
      let errorStack = args[0]?.stack || "";
      appendLogToPage("error", errorMessage, errorStack);
      originalConsoleError(...args);
    };

    // Global errors capture karna
    window.onerror = (message, source, lineno, colno, error) => {
      const errorMsg = `${message} at ${source}:${lineno}:${colno}`;
      const errorStack = error?.stack || "No stack trace available";
      appendLogToPage("error", errorMsg, errorStack);
    };

    // Unhandled promise rejection handle karna
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

// 🛠 Render the app with GlobalLogger
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <JobsProvider>
        <BackEndApiProvider>
          <UserDataProvider>
            <GlobalLogger>
              <App />
            </GlobalLogger>
          </UserDataProvider>
        </BackEndApiProvider>
      </JobsProvider>
    </ThemeProvider>
  </BrowserRouter>
);
