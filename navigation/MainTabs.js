import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RestaurantListScreen from '../screens/RestaurantListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import MyReservationsScreen from '../screens/MyReservationsScreen';
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0d0d0d' },
        tabBarActiveTintColor: '#ff4444',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Restaurants"
        component={RestaurantListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
  name="Reservations"
  component={MyReservationsScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="calendar" color={color} size={size} />
    ),
  }}
/>
    </Tab.Navigator>
  );
};

export default MainTabs;
