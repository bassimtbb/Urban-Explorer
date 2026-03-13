/**
 * @file AppNavigator.tsx
 * @description Fichier racine de Configuration du routage avec React Navigation.
 * Structure l'application en 2 niveaux de hiérarchie : Un BottomTab (Menu bas de l'application principal) 
 * et Un Stack (Empilement de pages avec bouton retour "Back").
 */
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

// ----- Types de navigation (Strict Typechecking pour interdire les mauvaises routes vers/depuis ces écrans) -----
export type RootStackParamList = {
  DecouverteTab: undefined; // L'écran de base ne nécessite aucun paramètre parent
  Details: { lieu: Lieu }; // L'écran Détail DOIT obligatoirement recevoir l'objet "lieu" (De la liste des lieux au onPress)
};

export type BottomTabParamList = {
  DecouverteStack: undefined;
  Carte: undefined;
  MesVisites: undefined;
  MonProfil: undefined;
};

// ----- Stack Navigator (Le conteneur Découverte → Détails) -----
const Stack = createStackNavigator<RootStackParamList>();

/**
 * On "encapsule" (nest) l'écran de Découverte dans un "Stack" avec l'écran Détails.
 * Cela permet à l'utilisateur de cliquer sur un élément et de naviguer "à l'intérieur" du même onglet,
 * avec un header retour visuel automatique.
 */
const DecouverteStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
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

// ----- Bottom Tab Navigator (Le conteneur racine avec la barre en bas d'App) -----
const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      // Options de style appliquées globalement aux 4 différents écrans/onglets
      screenOptions={({ route }) => ({
        headerShown: false, // On masque le header natif par défaut
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';

          // Mapping : Chaque RootName reçoit un icon statique Vectoriel natif selon son focus
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
      {/* 
        Le premier onglet affiche un Composant "Stack", contenant 2 Ecrans internes.
      */}
      <Tab.Screen
        name="DecouverteStack"
        component={DecouverteStackNavigator}
        options={{ title: 'Découverte' }}
      />
      {/* 
        Les 3 onglets standards dirigent vers les Screens Root/Simples
      */}
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
