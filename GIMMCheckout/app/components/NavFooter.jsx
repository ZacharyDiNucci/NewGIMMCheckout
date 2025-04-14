import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NavFooter = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'available' ? styles.activeTab : styles.inactiveTab,
          { flex: activeTab === 'available' ? 2 : 1 }
        ]}
        onPress={() => setActiveTab('available')}
      >
        <Text style={styles.tabText}>Available</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'active' ? styles.activeTab : styles.inactiveTab,
          { flex: activeTab === 'active' ? 2 : 1 }
        ]}
        onPress={() => setActiveTab('active')}
      >
        <Text style={styles.tabText}>Active</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  inactiveTab: {
    backgroundColor: '#ccc',
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NavFooter;
