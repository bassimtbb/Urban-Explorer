import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Lieu } from '../types';

interface Props {
  lieu: Lieu;
  onPress: () => void;
}

export default function LieuCard({ lieu, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {lieu.cover_url ? (
        <Image
          source={{ uri: lieu.cover_url }}
          style={styles.image}
          transition={500}
          contentFit="cover"
          placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>📷</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{lieu.title}</Text>
        <Text style={styles.address} numberOfLines={1}>
          📍 {lieu.address_street}, {lieu.address_zipcode} {lieu.address_city}
        </Text>
        {lieu.lead_text ? (
          <Text style={styles.lead} numberOfLines={2}>{lieu.lead_text}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
  },
  placeholder: {
    backgroundColor: '#E1E9EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  address: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  lead: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    lineHeight: 20,
  },
});