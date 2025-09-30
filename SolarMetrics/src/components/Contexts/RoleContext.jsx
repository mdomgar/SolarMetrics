import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useToken } from "./TokenContext";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const { token } = useToken();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded?.role);
      setUsername(decoded?.sub)
    }
  }, [token]);



  return (
    <RoleContext.Provider value={{ role, currentUser: username }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
