import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../app.styles';

const ReservationSystem = () => {
    const [techItems, setTechItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeviceTypes();
    }, []);

    const fetchDeviceTypes = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/item-categories`);
          const data = await response.json();
          setTechItems(data);
        } catch (error) {
          console.error("Error fetching device types:", error);
        } finally {
          setLoading(false);
        }
      };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item}>
          <Image
            source={{ uri: `${API_BASE_URL}/local-bucket/` + item.image_url }}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.itemText}>{item.device_name}</Text>
        </TouchableOpacity>
      );

    return (
        <>
        <Text style={styles.headerText}>What would you like to borrow?</Text>
        <View style={styles.containerLight}>
            {loading ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
                  ) : (
                    <FlatList
                      data={techItems}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={2}  
                      columnWrapperStyle={styles.row}
                      contentContainerStyle={styles.listContent}
                    />
                  )}
        </View>
        </>
    )
};

export default ReservationSystem;