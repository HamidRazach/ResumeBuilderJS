// AuthContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [onboarding, setOnboarding] = useState(null);


  const login = (token, userId,type,onboarding) => {
    setToken(token);
    setUserId(userId);
    setUserType(type)
    setOnboarding(onboarding)
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUserType(null)
    setOnboarding(null)
  };

  return (
    <AuthContext.Provider value={{ token, userId,userType, onboarding, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
