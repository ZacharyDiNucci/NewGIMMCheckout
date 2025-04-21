import React from "react";
import { Modal, View, Text, Image, Button, Alert } from "react-native";
import styles from '../app.styles';
import { API_BASE_URL } from "../config";

export default function AdminModal({ visible, onClose, item }) {
  if (!visible) return null;

const onReturned = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/return?loanId=${item.loan_id}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Failed to update return status");
    }

    Alert.alert("Success", "Item marked as returned.");
    onClose();
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Could not mark item as returned.");
  }
};

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={{ uri: `${API_BASE_URL}/local-bucket/` + item.image_url }} style={styles.modalImage} resizeMode="contain" />
          <Text style={styles.modalText}>
            Loaned By:  <Text style={{ fontWeight: 'bold' }}>{item.first_name} {item.last_name}</Text>
          </Text>
          <Text style={styles.modalText}>
            {item.device_name} <Text style={{ fontWeight: 'bold' }}>#{item.device_number}</Text>
          </Text>
          <Text style={styles.modalText}>{item.description}</Text>
          <Text style={styles.modalText}>
            <Text style={{ fontWeight: 'bold' }}>Due:</Text> {new Date(item.due_date).toLocaleDateString()}
          </Text>
          <View style={styles.modalButtonRow}>
            <View style={styles.button}>
              <Button title="Returned" onPress={onReturned} />
            </View>
            <View style={styles.button}>
              <Button title="Close" onPress={onClose} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
