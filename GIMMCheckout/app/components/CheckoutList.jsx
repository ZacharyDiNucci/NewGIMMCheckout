import React, { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import InfoModal from "./InfoModal"; // Adjusted import path

const sampleData = [
  { id: "1", title: "Laptop", info: "Dell XPS 13 - checked out for development." },
  { id: "2", title: "Camera", info: "Canon EOS M50 - used for content creation." },
  { id: "3", title: "Microphone", info: "Blue Yeti - ideal for podcasts and voice-over." },
];

export default function CheckoutList() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState("");

  const openModal = (infoText) => {
    setSelectedInfo(infoText);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sampleData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.title}</Text>
            <Button title="Info" onPress={() => openModal(item.info)} />
          </View>
        )}
      />
      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        content={selectedInfo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
});
