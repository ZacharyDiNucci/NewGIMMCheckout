import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, CheckBox } from "react-native";
import { useAuth } from '../AuthContext';
import styles from '../app.styles';
import { API_BASE_URL } from '../config';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);  // Add state for "Remember Me"
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const { setAccountToken } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      const json = await response.json();
  
      if (response.status === 200) {
        // ✅ Use context to store token AND update login status
        await setAccountToken(json.token);
  
        Alert.alert("Login Successful", "Redirecting to dashboard...");
        // navigation.navigate("TechCategoryList");
      } else {
        setErrorMessage(json.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("An error occurred during login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}