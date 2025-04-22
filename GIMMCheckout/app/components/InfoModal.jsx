import React from "react";
import { Modal, View, Text, Image, Button, StyleSheet } from "react-native";
import styles from '../app.styles';
import { API_BASE_URL } from "../config";

export default function InfoModal({ visible, onClose, item}) {
  if (!visible) return null; // Don't render modal if not visible
  console.log(item);

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
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
