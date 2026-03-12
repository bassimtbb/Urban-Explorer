import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import DecouverteScreen from '../screens/DecouverteScreen';
import CarteScreen from '../screens/CarteScreen';
import ProfilScreen from '../screens/ProfilScreen';
import DetailsScreen from '../screens/DetailsScreen';

export type RootStackParamList = {
  DecouverteTab: undefined;
  Details: undefined;
};

export type BottomTabParamList = {
  DecouverteStack: undefined;
  Carte: undefined;
  MonProfil: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const DecouverteStackNavigator = () => {
  return (
    <Stack.Navigator>
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

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="DecouverteStack" 
        component={DecouverteStackNavigator} 
        options={{ title: 'Découverte', headerShown: false }} 
      />
      <Tab.Screen 
        name="Carte" 
        component={CarteScreen} 
        options={{ title: 'Carte' }} 
      />
      <Tab.Screen 
        name="MonProfil" 
        component={ProfilScreen} 
        options={{ title: 'Mon Profil' }} 
      />
    </Tab.Navigator>
  );
}
