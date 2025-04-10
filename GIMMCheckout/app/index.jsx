import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, CheckBox } from "react-native";
import styles from './app.styles';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);  // Add state for "Remember Me"
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleLogin = async () => {
    console.log("Username:", username);  // Debugging
    console.log("Password:", password);  // Debugging

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": username,
          "password": password,
          "remember-me": rememberMe,
        }),
        credentials: 'include',
      });

      const json = await response.json();

      if (response.status === 200) {
        window.location.href = "/CheckoutList"; // Redirect to the dashboard
        Alert.alert("Login Successful", "Redirecting to dashboard...");
      } else {
        setErrorMessage(json.message || "Invalid credentials"); // Set error message
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("An error occurred during login."); // Set error message
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

      {/* <View style={styles.rememberMeContainer}>
        <CheckBox
          value={rememberMe}
          onValueChange={setRememberMe}
        />
        <Text style={styles.rememberMeText}>Remember Me</Text>
      </View> */}

      {/* Display error message under Remember Me */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}