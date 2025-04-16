import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../app.styles';

const ReservationSystem = () => {
    const [techItems, setTechItems] = useState([]);
    const [selectedCatagory, setSelectedCatagory] = useState([]);
    const [loadingDeviceTypes, setLoadingDeviceTypes] = useState(true);
    const [loadingDevices, setLoadingDevices] = useState(true);

    useEffect(() => {
      fetchDeviceCatagories();
    }, []);

    const fetchDeviceCatagories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/item-categories`);
        const data = await response.json();
        setTechItems(data);
      } catch (error) {
        console.error("Error fetching device types:", error);
      } finally {
        setLoadingDeviceTypes(false);
      }
    };

    const parseID = (id) => {
      if (id === 1) {

      } else {
        fetchDevices(id + 2);
      }
    };

    const renderDeviceTypes = ({ item }) => {    
      return (
        <TouchableOpacity style={styles.techButton} onPress={() => parseID(item.id)}> 
          <Image
            source={{ uri: `${API_BASE_URL}/local-bucket/` + item.image_url }}
            style={styles.techImage}
            resizeMode="contain"
          />
          <Text style={styles.techText}>{item.category_name}</Text> {/* Change device_name to category_name */}
        </TouchableOpacity>
      );
    };

    const fetchDeviceTypes = async (typeId) => {
      console.log("Fetching devices for type ID:", typeId);
      try {
        const response = await fetch(`${API_BASE_URL}/api/device/${typeId}`);
        const data = await response.json();
        console.log("Fetched devices:", data);
        setSelectedCatagory(data);
      } catch (error) {
        console.error("Error fetching device types:", error);
      } finally {
        setLoadingDevices(false);
      }
    };
    
    const fetchDevices = async (typeId) => {
      console.log("Fetching devices for type ID:", typeId);
      try {
        const response = await fetch(`${API_BASE_URL}/api/device/${typeId}`);
        const data = await response.json();
        console.log("Fetched devices:", data);
        setSelectedCatagory(data);
      } catch (error) {
        console.error("Error fetching device types:", error);
      } finally {
        setLoadingDevices(false);
      }
    };


    const renderDevices = ({ item }) => {
      console.log("Rendering item:", item);  // Log each item to ensure it has expected fields
    
      return (
        <TouchableOpacity style={styles.techButton}>
          <Image
            source={{ uri: `${API_BASE_URL}/local-bucket/` + item.image_url }}
            style={styles.techImage}
            resizeMode="contain"
          />
          <Text style={styles.techText}>{item.category_name}</Text> {/* Change device_name to category_name */}
        </TouchableOpacity>
      );
    };

    return (
        <>
        <Text style={styles.prompt}>What would you like to borrow?</Text>
        <View style={styles.container}>
            {loadingDeviceTypes ? (
              <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
            ) : (
                    <FlatList
                      data={techItems}
                      renderItem={renderDeviceTypes}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={2}  
                      columnWrapperStyle={styles.techRow}
                      contentContainerStyle={styles.listContent}
                    />
                  )}
        </View>
        </>
    )
};

export default ReservationSystem;