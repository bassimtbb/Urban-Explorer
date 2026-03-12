import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Lieu } from '../types';

interface Props {
  lieu: Lieu;
  onPress: () => void;
}

export default function LieuCard({ lieu, onPress }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://picsum.photos/200?random=${lieu.nom_usuel}` }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{lieu.nom_usuel}</Text>
        <Text style={styles.address}>{lieu.adresse}</Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Voir plus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 150,
  },

  content: {
    padding: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  address: {
    color: '#555',
    marginTop: 4,
  },

  button: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});