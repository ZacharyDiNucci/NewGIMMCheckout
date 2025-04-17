import React from "react";
import { Modal, View, Text, Image, Button, StyleSheet } from "react-native";
import styles from '../app.styles';
import { API_BASE_URL } from "../config";

export default function InfoModal({ visible, onClose, item}) {
  if (!visible) return null; // Don't render modal if not visible

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
          <Text style={styles.modalText}><b>Borrowed:</b> {new Date(item.borrow_datetime).toLocaleDateString()}</Text>
          <Text style={styles.modalText}><b>Due:</b> {new Date(item.due_date).toLocaleDateString()} </Text> 
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
