// import React, { createContext, useContext, useState, useEffect } from 'react';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', isDarkMode);
//     localStorage.setItem('darkMode', isDarkMode);
//   }, [isDarkMode]);

//   const toggleTheme = () => setIsDarkMode(prev => !prev);

//   return (
//     <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);
