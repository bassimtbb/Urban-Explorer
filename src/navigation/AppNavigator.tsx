import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Lieu } from '../types';

import DecouverteScreen from '../screens/DecouverteScreen';
import CarteScreen from '../screens/CarteScreen';
import ProfilScreen from '../screens/ProfilScreen';
import PlanningScreen from '../screens/PlanningScreen';
import DetailsScreen from '../screens/DetailsScreen';

// ----- Types de navigation -----
export type RootStackParamList = {
  DecouverteTab: undefined;
  Details: { lieu: Lieu };
};

export type BottomTabParamList = {
  DecouverteStack: undefined;
  Carte: undefined;
  MesVisites: undefined;
  MonProfil: undefined;
};

// ----- Stack Navigator (Découverte → Détails) -----
const Stack = createStackNavigator<RootStackParamList>();

const DecouverteStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="DecouverteTab"
        component={DecouverteScreen}
        options={{ title: 'Découverte' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Détails' }}
      />
    </Stack.Navigator>
  );
};

// ----- Bottom Tab Navigator -----
const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';

          if (route.name === 'DecouverteStack') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Carte') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'MesVisites') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'MonProfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          marginBottom: 10,
          paddingBottom: 10,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen
        name="DecouverteStack"
        component={DecouverteStackNavigator}
        options={{ title: 'Découverte' }}
      />
      <Tab.Screen
        name="Carte"
        component={CarteScreen}
        options={{ title: 'Carte' }}
      />
      <Tab.Screen
        name="MesVisites"
        component={PlanningScreen}
        options={{ title: 'Mes Visites' }}
      />
      <Tab.Screen
        name="MonProfil"
        component={ProfilScreen}
        options={{ title: 'Mon Profil' }}
      />
    </Tab.Navigator>
  );
}
