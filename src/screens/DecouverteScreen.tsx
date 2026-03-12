// 📋 Tâche de Mohamed — Écran Découverte (liste des lieux)
import React from 'react';
import { Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type DecouverteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DecouverteTab'>;

export default function DecouverteScreen() {
  const navigation = useNavigation<DecouverteScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔍 Écran Découverte</Text>
      <Text style={styles.subtitle}>Liste des lieux parisiens</Text>
      <Button
        title="Voir les détails"
        onPress={() => navigation.navigate('Details')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 20 },
});
