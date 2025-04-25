import React from "react";
import {useState} from "react";
import { Modal, View, Text, Image, Button, StyleSheet } from "react-native";
import styles from '../app.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../config";

export default function InfoModal({ visible, onClose, item}) {
  if (!visible) return null; // Don't render modal if not visible
  console.log(item);

  const [isReturning, setIsReturning] = useState(false);

  const returnDevice = async (item) => {
    try {
      const token = await AsyncStorage.getItem('accountToken'); // Retrieve token from AsyncStorage
      console.log("returning equipment");
      if (!token) {
        setError('No token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/user-devices`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Pass the token in the Authorization header
        },
        body: JSON.stringify({ 
          token: token,
          item: item
         }),
      });

      if (response.ok) {
      } else {
        setError('Failed to return device');
      }
      setIsReturning(false);
    } catch (error) {
      setError('An error occurred while returning device');
      console.error(error);
    }
  }

  const itemModal = () => {
    return(
      <View style={styles.modalContent}>
        <Image source={{ uri: `${API_BASE_URL}/local-bucket/` + item.image_url }} style={styles.modalImage} resizeMode="contain"/>
        <Text style={styles.modalText}>
          <Text>{item.device_name} </Text>
          <Text style={styles.modalTextBold}>#{item.device_number}</Text>
        </Text> 
        <Text style={styles.modalText}>{item.description}</Text>
        <Text style={styles.modalText}>
          <Text style={styles.modalTextBold}>Borrowed: </Text>
          <Text>{new Date(item.borrow_datetime).toLocaleDateString()}</Text>
        </Text>
        <Text style={styles.modalText}>
          <Text style={styles.modalTextBold}>Due: </Text>
          <Text>{new Date(item.due_date).toLocaleDateString()}</Text>
        </Text>
        <Button title="Return" onPress={() => setIsReturning(true)} />
        <Button title="Close" onPress={onClose} />
      </View>
    );
  }

  const returnModal = () => {
    return(
      <View style={styles.modalContent}>
        <Image source={{ uri: `${API_BASE_URL}/local-bucket/` + item.image_url }} style={styles.modalImage} resizeMode="contain"/>
        <Text style={styles.modalText}>
          <Text>{item.device_name} </Text>
          <Text style={styles.modalTextBold}>#{item.device_number}</Text>
        </Text> 
        <Text style={styles.modalText}>Are you sure you would like to return this equipment?</Text>
        <Text style={styles.modalTextBold}>Press confirm when you have returned the equipment to an admin.</Text>
        <Button title="Confirm" onPress={() => returnDevice(item)} />
        <Button title="Cancel" onPress={() => setIsReturning(false)} />
      </View>
    );
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {isReturning ? returnModal() : itemModal()}
      </View>
    </Modal>
  );
}
