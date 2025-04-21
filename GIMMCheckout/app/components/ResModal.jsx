import React from "react";
import { Modal, View, Text, Image, Button, StyleSheet } from "react-native";
import styles from '../app.styles';
import { API_BASE_URL } from "../config";

export default function InfoModal({ visible, onClose, item}) {
  if (!visible) return null; // Don't render modal if not visible

  const now = new Date();
  now.setDate(now.getDate() + 7); //TODO: store rental period in db and get here instead of hardcoded

  const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();

  const dueDate = `${mm}/${dd}/${yyyy}`;
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
      </View>
    </Modal>
  );
}
