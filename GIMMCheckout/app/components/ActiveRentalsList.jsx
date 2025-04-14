import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfoModal from "./InfoModal"; // Import InfoModal component
import styles from '../app.styles';

const ActiveRentalsList = () => {
    const { isLoggedIn } = useAuth();
    const [devices, setDevices] = useState(null);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserDevices();
        }
    }, [isLoggedIn]);

    // Function to fetch user devices
  const fetchUserDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('accountToken'); // Retrieve token from AsyncStorage

      if (!token) {
        setError('No token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/user-devices`, {
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

  const openModal = (item) => {
    setSelectedItem(item);  // Set the selected item
    setModalVisible(true);      // Show the modal
  };

  // Function to close modal
  const closeModal = () => {
    setModalVisible(false); // Hide the modal
  };


  return (
    <>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {devices ? (
            <FlatList
            data={devices}
            keyExtractor={(item) => item.loan_id.toString()}
            ListHeaderComponent={
              <View style={styles.headerRow}>
                <Text style={[styles.headerText, styles.nameColumn]}>Name</Text>
                <Text style={[styles.headerText, styles.countColumn]}>#</Text>
                <Text style={[styles.headerText, styles.dueColumn]}>Due By</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openModal(item)}>
                <View style={styles.itemRow}>
                  <Text style={[styles.itemText, styles.nameColumn]}>{item.device_name}</Text>
                  <Text style={[styles.itemText, styles.countColumn]}>{item.device_number}</Text>
                  <Text style={[styles.itemText, styles.dueColumn]}>
                    {new Date(item.due_date).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
            <Text>Loading devices...</Text>
        )}
        <InfoModal visible={modalVisible} onClose={closeModal} item={selectedItem} />
    </>
  );
};

export default ActiveRentalsList;