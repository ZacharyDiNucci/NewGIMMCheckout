import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfoModal from "./InfoModal"; // Import InfoModal component
import styles from '../app.styles';

const ActiveRentalsList = () => {
    const { isLoggedIn } = useAuth();
    const [devicesLoaned, setDevicesLoaned] = useState(null);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserDevices();
        }
    }, [isLoggedIn]);

    // Function to fetch user devicesLoaned
  const fetchUserDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('accountToken'); // Retrieve token from AsyncStorage

      if (!token) {
        setError('No token found');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/loaned-devices`);
      const data = await response.json();
      setDevicesLoaned(data);

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
        {devicesLoaned ? (
        <View style={styles.container}>
            <Text style={styles.prompt}>Currently Checked Out Equipment</Text>
            <FlatList
            data={devicesLoaned}
            keyExtractor={(item) => item.loan_id.toString()}
            ListHeaderComponent={
              <View style={styles.headerRow}>
                <Text style={[styles.columnHeader, styles.nameColumn]}>Name</Text>
                <Text style={[styles.columnHeader, styles.countColumn]}>#</Text>
                <Text style={[styles.columnHeader, styles.dueColumn]}>Due By</Text>
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
          </View>
        ) : (
            <Text>Loading devices...</Text>
        )}
        <InfoModal visible={modalVisible} onClose={closeModal} item={selectedItem} />
    </>
  );
};

export default ActiveRentalsList;