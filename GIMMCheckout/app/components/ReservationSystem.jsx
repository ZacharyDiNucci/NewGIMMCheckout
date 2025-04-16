import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from '../config';
import ResModal from "./ResModal";
import styles from '../app.styles';

const ReservationSystem = () => {
  const [techItems, setTechItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    types: false,
    devices: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/item-categories`);
      const data = await response.json();
      setTechItems(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchDeviceTypes = async (categoryId) => {
    setLoading(prev => ({ ...prev, types: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/device-types?categoryId=${categoryId}`);
      const data = await response.json();
      setDeviceTypes(data);
    } catch (error) {
      console.error("Error fetching device types:", error);
    } finally {
      setLoading(prev => ({ ...prev, types: false }));
    }
  };  

  const fetchDevices = async (typeId) => {
    setLoading(prev => ({ ...prev, devices: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/device/${typeId}`);
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(prev => ({ ...prev, devices: false }));
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  
    fetchDeviceTypes(category.id);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    fetchDevices(type.id);
  };

  const goBack = () => {
    setSelectedType(null);
    setSelectedCategory(null);
    setDevices([]);
    setDeviceTypes([]);
    setLoading({ categories: false, types: false, devices: false });
  };

  const renderCategories = ({ item }) => (
    <TouchableOpacity style={styles.techButton} onPress={() => handleCategorySelect(item)}>
      <Image
        source={{ uri: `${API_BASE_URL}/local-bucket/${item.image_url}` }}
        style={styles.techImage}
        resizeMode="contain"
      />
      <Text style={styles.techText}>{item.category_name}</Text>
    </TouchableOpacity>
  );

  const renderTypes = ({ item }) => {
    if (!item.id) return null;

    return (
      <TouchableOpacity style={styles.techButton} onPress={() => handleTypeSelect(item)}>
        <Image
          source={{ uri: `${API_BASE_URL}/local-bucket/${item.image_url}` }}
          style={styles.techImage}
          resizeMode="contain"
        />
        <Text style={styles.techText}>{item.type_name}</Text>
      </TouchableOpacity>
    );
  };

  const renderDevices = ({ item }) => {
    if (!item.device_type_id) return null;

    return (
      <TouchableOpacity style={styles.deviceButton} onPress={() => openModal(item)}>
        <Image
          source={{ uri: `${API_BASE_URL}/local-bucket/${item.image_url}` }}
          style={styles.techImage}
          resizeMode="contain"
        />
        <Text style={styles.deviceText}>{item.device_name}</Text>
      </TouchableOpacity>
    );
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
    <View style={styles.container}>
      <Text style={styles.prompt}>What would you like to borrow?</Text>
  
      {(selectedCategory || selectedType) && (
        <View style={styles.deviceHeader}>
          <Button title="Back" onPress={goBack} />
          <Text style={styles.techTitle}>
            {selectedType?.type_name || selectedCategory?.category_name}
          </Text>
        </View>
      )}
  
      {selectedType ? (
        loading.devices ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            key={"devices"}
            data={devices}
            renderItem={renderDevices}
            keyExtractor={(item, index) => `${item.device_type_id}-${index}`}
            numColumns={1}
            contentContainerStyle={styles.listContent}
          />
        )
      ) : selectedCategory ? (
        loading.types ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            key={"types"}
            data={deviceTypes}
            renderItem={renderTypes}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.techRow}
            contentContainerStyle={styles.listContent}
          />
        )
      ) : loading.categories ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          key={"categories"}
          data={techItems}
          renderItem={renderCategories}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.techRow}
          contentContainerStyle={styles.listContent}
        />
      )}
      <ResModal visible={modalVisible} onClose={closeModal} item={selectedItem} />
    </View>
  );
}

export default ReservationSystem;
