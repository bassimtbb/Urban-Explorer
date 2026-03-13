/**
 * @file ErrorState.tsx
 * @description Composant UI réutilisable pour afficher un fallback visuel d'erreur 
 * ou d'état vide (Search List Video, Problème API) centré à l'écran. 
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  message: string;
  // Utilisation d'un type Literal Union dynamique basé sur la collection d'icones native Ionicons 
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function ErrorState({ message, icon = 'wifi-outline' }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color="#C7C7CC" style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend toute la hauteur disponible de son composant parent (View/ScrollView)
    justifyContent: 'center', // Centrage flexbox vertical
    alignItems: 'center', // Centrage flexbox horizontal
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});
