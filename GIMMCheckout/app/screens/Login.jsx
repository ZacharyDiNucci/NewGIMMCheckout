import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Checkbox} from "react-native";
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
        Consol.log("levle", json.level)
        await setAccountToken(json.token, json.level);
  
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


    <View style={styles.loginScreenContainer}>
      <Text style={styles.loginHeader}>GIMM Checkout</Text>

      <TextInput
        style={styles.loginInput}
        placeholder="Username"
        placeholderTextColor="#555"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.loginInput}
        placeholder="Password"
        placeholderTextColor="#555"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.loginLinkText}>Request Account</Text>
      </TouchableOpacity>
    </View>
  );
}