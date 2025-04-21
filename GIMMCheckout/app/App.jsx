import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn } = useAuth();

  const { isAdmin } = useAuth();

  if (isLoggedIn === null) return null;

    const checkLogin = async () => {
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


  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={Login} />
        ) : ( 
          <Stack.Screen name="Dashboard" component={Dashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
