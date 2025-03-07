import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () =>
    {
     const {darkMode, setDarkMode ,toggleTheme} =    useContext(ThemeContext);
        return {darkMode, setDarkMode , toggleTheme};
    }
        

export const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem("darkMode") || false;
  const [darkMode, setDarkMode] = useState(JSON.parse(storedTheme));

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  useEffect(() => {
    if(darkMode === false)
    {
      document.body.classList.remove("dark-mode"); 
    }
    else if(darkMode === true)
    {
      document.body.classList.add("dark-mode");
    }

  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode , toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
