import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [permissionLevel, setPermissionLevel] = useState(null);


  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accountToken");
      const level = await AsyncStorage.getItem("permissionLevel");
      console.log("Token:", token, "Level:", level);
  
      if (!token) {
        setIsLoggedIn(false);
        setPermissionLevel(null);
        return;
      }
  
      const res = await fetch(`${API_BASE_URL}/api/check-token`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ token }),
      });
  
      if (res.status === 200) {
        setIsLoggedIn(true);
        setPermissionLevel(Number(level)); // <- make sure it's a number
      } else {
        setIsLoggedIn(false);
        setPermissionLevel(null);
      }
    } catch (err) {
      console.error("Error validating token:", err);
      setIsLoggedIn(false);
      setPermissionLevel(null);
    }
  };
  
  

  const setAccountToken = async (token, level = null) => {
    if (token) {
      await AsyncStorage.setItem("accountToken", token);
      if (level !== null) {
        await AsyncStorage.setItem("permissionLevel", level);
        setPermissionLevel(level);
      }
    } else {
      await AsyncStorage.removeItem("accountToken");
      await AsyncStorage.removeItem("permissionLevel");
      setPermissionLevel(null);
    }
    await checkToken();
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setAccountToken, permissionLevel }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
