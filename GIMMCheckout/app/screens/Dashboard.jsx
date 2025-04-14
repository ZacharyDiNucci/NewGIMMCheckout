import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../AuthContext';
import { LogoutButton } from '../components/LogoutButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../app.styles';

const Dashboard = () => {
  const { isLoggedIn, setAccountToken } = useAuth();  // Access AuthContext to get the token and login state
  const [devices, setDevices] = useState(null);  // State to store the fetched devices
  const [error, setError] = useState(null);  // State to store any errors

  useEffect(() => {
    // If the user is logged in, fetch user devices
    if (isLoggedIn) {
      fetchUserDevices();
    }
  }, [isLoggedIn]);  // Run when isLoggedIn changes

  // Function to fetch user devices
  const fetchUserDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('accountToken'); // Retrieve token from AsyncStorage

      if (!token) {
        setError('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/user-devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Pass the token in the Authorization header
        },
        body: JSON.stringify({ token: token }),
      });

      if (response.ok) {
        const data = await response.json();
        setDevices(data);  // Set the fetched devices data
      } else {
        setError('Failed to fetch devices');
      }
    } catch (error) {
      setError('An error occurred while fetching devices');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {devices ? (
        <View>
          {/* TODO: dynamically create list items from devices */}
          <Text>Devices: {JSON.stringify(devices)}</Text>
        </View>
      ) : (
        <Text>Loading devices...</Text>
      )}
      <Button title="Refresh" onPress={fetchUserDevices} />
      <LogoutButton />
    </View>
  );
};

export default Dashboard;
