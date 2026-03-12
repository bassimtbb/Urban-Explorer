// 📋 Tâche de Karim — Écran Détails (Fiche lieu + Calendrier)
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📍 Détails du lieu</Text>
      <Text style={styles.subtitle}>Informations détaillées à venir</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888' },
});
