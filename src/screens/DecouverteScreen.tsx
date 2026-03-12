import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type DecouverteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DecouverteTab'>;

export default function DecouverteScreen() {
  const navigation = useNavigation<DecouverteScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Découverte Screen</Text>
      <Button 
        title="Voir les détails" 
        onPress={() => navigation.navigate('Details')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});
