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
  const [loans, setLoans] = useState([]);
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
      console.log("Devices data:", data); // Log the devices data
      setDevices(data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(prev => ({ ...prev, devices: false }));
    }
  };

  const fetchLoans = async (typeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/loaned-devices/by-type?typeId=${typeId}`);  // Pass typeId as query parameter
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error("Error fetching loans:", error);
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
    fetchLoans(type.id);
  };

  const goBack = () => {
    setSelectedType(null);
    setSelectedCategory(null);
    setDevices([]);
    setDeviceTypes([]);
    setLoans([]);
    setLoading({ categories: false, types: false, devices: false });
  };

  const renderCategories = ({ item }) => (
    <TouchableOpacity style={styles.techButton} onPress={() => handleCategorySelect(item)}>
      <Image
        source={{ uri: `${API_BASE_URL}/local-bucket/${item.image_url}` }}
        style={styles.typeImage}
        resizeMode="contain"
      />
      <Text style={styles.techText}>{item.category_name}</Text>
    </TouchableOpacity>
  );

  const renderTypes = ({ item }) => {
    if (!item.id) return null;

    return (
      <TouchableOpacity style={styles.typeButton} onPress={() => handleTypeSelect(item)}>
        <Image
          source={{ uri: `${API_BASE_URL}/local-bucket/${item.image_url}` }}
          style={styles.typeImage}
          resizeMode="contain"
        />
        <Text style={styles.techText}>{item.device_name}</Text>
      </TouchableOpacity>
    );
  };

  const renderDevices = ({ item }) => {
    if (!item.device_type_id) return null;

    // Check if the device is loaned
    const isLoaned = loans.some(loan => loan.device_number === item.device_number);

    return (
      <TouchableOpacity
        style={[styles.deviceButton, isLoaned && styles.disabledButton]}  // Disable if loaned
        disabled={isLoaned}  // Disable the device if it's loaned
        onPress={() => !isLoaned && openModal(item)}  // Only open modal if not loaned
      >
        <Image
          source={{ uri: `${API_BASE_URL}/local-bucket/${item.image_url}` }}
          style={styles.techImage}
          resizeMode="contain"
        />
        <Text style={styles.deviceText}>
          {item.device_name} {isLoaned && "(Loaned)"}
        </Text>
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
  
      {selectedType ? (
        <View style={styles.containerLight}>
          {(selectedCategory || selectedType) && (
            <View style={styles.deviceHeader}>
              <Button title="Back" onPress={goBack} />
              <Text style={styles.techTitle}>
                {selectedType?.type_name || selectedCategory?.category_name}
              </Text>
            </View>
          )}
  
          {loading.devices ? ( // Correct the conditional rendering
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
          )}
        </View>
      ) : selectedCategory ? (
        <View style={styles.containerLight}>
          {(selectedCategory || selectedType) && (
            <View style={styles.deviceHeader}>
              <Button title="Back" onPress={goBack} />
              <Text style={styles.techTitle}>
                {selectedType?.type_name || selectedCategory?.category_name}
              </Text>
            </View>
          )}
  
          {loading.types ? ( // Correct the conditional rendering
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
          )}
        </View>
      ) : loading.categories ? (
        <View style={styles.container}>
          {(selectedCategory || selectedType) && (
            <View style={styles.deviceHeader}>
              <Button title="Back" onPress={goBack} />
              <Text style={styles.techTitle}>
                {selectedType?.type_name || selectedCategory?.category_name}
              </Text>
            </View>
          )}
  
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
        </View>
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
