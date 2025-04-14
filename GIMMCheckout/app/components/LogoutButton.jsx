import React from 'react';
import { Button } from 'react-native';
import { useAuth } from '../AuthContext';

export const LogoutButton = () => {
  const { setAccountToken } = useAuth();

  const handleLogout = async () => {
    try {
      setAccountToken("");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
};
