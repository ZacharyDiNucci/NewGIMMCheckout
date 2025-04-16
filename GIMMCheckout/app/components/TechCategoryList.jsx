import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

const API_URL = "http://localhost:5000/api/device-types";
const IMAGE_BASE_URL = "http://localhost:500/uploads/";

const TechCategoryList = () => {
  const [techItems, setTechItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const fetchDeviceTypes = async () => {
    try {
      const response = await fetch(API_URL);
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
        source={{ uri: IMAGE_BASE_URL + item.image_url }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.itemText}>{item.device_name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome, User!</Text>
        <Text style={styles.date}>April 6th, 2025</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>
          What would you like to borrow?
        </Text>
      </View>


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

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Available Tech</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>My Tech</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3E3E42",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  date: {
    fontSize: 16,
    color: '#b0b0b0',
    marginTop: 4,
    fontWeight:'bold',
    marginBottom: 20,
  },
  prompt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 10,
  },
  item: {
    backgroundColor: "#4D4D52",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    flex: 0.48,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  itemText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#2E2E33",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  tabText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTab: {
    backgroundColor: "#606067",
  },
  activeTabText: {
    color: "#fff",
  },
});

export default TechCategoryList;
