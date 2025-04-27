import React from "react";
import {useState} from "react";
import { Modal, View, Text, Image, Button, StyleSheet } from "react-native";
import styles from '../app.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../config";

export default function InfoModal({ visible, onClose, item}) {
  if (!visible) return null; // Don't render modal if not visible

  const now = new Date();
  now.setDate(now.getDate() + 7); //TODO: store rental period in db and get here instead of hardcoded

  const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();

  const dueDate = `${mm}/${dd}/${yyyy}`;
  const reserveDate = new Date();

  const [reserveSuccess, setReserveSuccess] = useState(false);

  const checkOutDevice = async (item) => {
    try {
      const token = await AsyncStorage.getItem('accountToken'); // Retrieve token from AsyncStorage
      
      if (!token) {
        setError('No token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/user-devices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Pass the token in the Authorization header
        },
        body: JSON.stringify({ 
          token: token,
          item: item,
          reserveDate: reserveDate
         }),
      });

      if (response.ok) {
        setReserveSuccess(true);
      } else {
        setError('Failed to check out devices');
      }
    } catch (error) {
      setError('An error occurred while checking out devices');
      console.error(error);
    }
  };

  const receiptModal = () => {
    return (
      <View style={styles.modalContent}> 
        <Text style={styles.modalText}>
          <Text>{item.device_name} </Text>
          <Text style={styles.modalTextBold}>#{item.device_number}</Text>
        </Text> 
        <Text style={styles.modalText}>{item.description}</Text>
        <Text style={styles.modalText}>
          <Text style={styles.modalTextBold}>Borrowed: </Text>
          <Text>{reserveDate.toLocaleDateString()}</Text>
        </Text>
        <Button title="I have received the equipment" onPress={() => checkOutDevice(item)} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    );
  }

  const successModal = () => {
    const dueDate = new Date();
    dueDate.setDate(new Date().getDate()+14);
    return (<View style={styles.modalContent}>
      <Image source={{ uri: `${API_BASE_URL}/local-bucket/` + item.image_url }} style={styles.modalImage} resizeMode="contain"/>
      <Text style={styles.modalText}>Success! Your item is now due back on the following date:</Text>
      <Text style={styles.modalTextBold}>{dueDate.toLocaleDateString()}</Text>
      <Button title="Close" onPress={onClose} />
    </View>);
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
        
          <Image source={{ uri: `${API_BASE_URL}/local-bucket/` + item.image_url }} style={styles.modalImage} resizeMode="contain"/>
          <Text style={styles.modalText}>{item.device_name} <b>#{item.device_number}</b></Text>
          <Text style={styles.modalText}>{item.description}</Text>
          <Text style={styles.modalText}><b>Rental Period:</b> 7d</Text> {/* TODO: dynamically calculate rental period */}
          <Text style={styles.modalText}><b>Due:</b> {dueDate} </Text> 
          <Button title="Close" onPress={onClose} />
        </View>
        {reserveSuccess ? successModal() : receiptModal()}
      </View>
    </Modal>
  );
}
