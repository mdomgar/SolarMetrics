import React, { createContext, useState, useContext, useEffect } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("jwtToken") || null);
  
    useEffect(() => {
      if (token) {
        localStorage.setItem("jwtToken", token);
      } else {
        localStorage.removeItem("jwtToken");
      }
    }, [token]);
  
    return (
      <TokenContext.Provider value={{ token, setToken }}>
        {children}
      </TokenContext.Provider>
    );
  };
  
  export const useToken = () => {
    return useContext(TokenContext);
  };