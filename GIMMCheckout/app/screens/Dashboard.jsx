import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActiveRentalsList from "../components/ActiveRentalsList";
import AdminRentalsList from "../components/AdminRentalsList";
import ReservationSystem from "../components/ReservationSystem";
import NavFooter from "../components/NavFooter";
import styles from '../app.styles';

const Dashboard = () => {
  const { isLoggedIn, setAccountToken, permissionLevel } = useAuth();  // Access AuthContext to get the token and login state
  const [userDetails, setUserDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [error, setError] = useState(null);  // State to store any errors

  useEffect(() => {
    // If the user is logged in, fetch user devices
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);  // Run when isLoggedIn changes

  const handleLogout = async () => {
    try {
      setAccountToken("");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('accountToken'); // ✅ get the token

      if (!token) {
        setError('No token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/user_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token: token }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data[0]);
      } else {
        setError('Failed to fetch user details');
      }
    } catch (error) {
      setError('An error occurred while fetching user details');
      console.error(error);
    }
  };

  const renderTabContent = () => {
    if (permissionLevel >= 2) {
      switch (activeTab) {
        case 'active':
          return <ActiveRentalsList />;
        case 'available':
          return <ReservationSystem />;
        case 'admin':
          return <AdminRentalsList />;
        default:
          return null; // fallback if needed
      }
    } else {
      return activeTab === 'active'
        ? <ActiveRentalsList />
        : <ReservationSystem />;
    }
  };
  

  return (
    <>
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcome}>
            {userDetails ? `Welcome, ${userDetails.first_name}` : 'Username'}
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        {renderTabContent()}
      </View>
      <NavFooter activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

export default Dashboard;
