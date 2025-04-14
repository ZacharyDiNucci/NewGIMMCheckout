import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accountToken");
      console.log(token);
      if (!token) return setIsLoggedIn(false);

      const res = await fetch(`${API_BASE_URL}/api/check-token`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({ token: token }),
      });

      setIsLoggedIn(res.status === 200);
    } catch (err) {
      console.error("Error validating token:", err);
      setIsLoggedIn(false);
    }
  };

  const setAccountToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("accountToken", token);
    } else {
      await AsyncStorage.removeItem("accountToken");
    }
    await checkToken();
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setAccountToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
