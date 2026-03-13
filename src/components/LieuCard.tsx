/**
 * @file LieuCard.tsx
 * @description Composant UI réutilisable affichant la vignette d'un lieu.
 * Utilisé principalement dans la FlatList de DecouverteScreen.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Lieu } from '../types';

/**
 * Propriétés attendues (Props) du Composant
 */
interface Props {
  lieu: Lieu; // L'objet de données intégral du lieu 
  onPress: () => void; // Fonction déclenchée au tap (permettant la navigation gérée par le Parent)
  plannedDate?: string; // String formatée de visite optionnelle (affichera un badge si présente)
}

/** 
 * Utilitaire interne au composant pour reformater YYYY-MM-DD en FR 
 */
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export default function LieuCard({ lieu, onPress, plannedDate }: Props) {
  return (
    // Touchable opacity natif permettant la réaction tactile (diminution d'opacité)
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageWrapper}>
        {/*
          Bascule Conditionnelle (Ternaire) : 
          1. Si l'API retourne une URI valide, utilisation du module expo-image
          2. Sinon, un encart visuel fixe (Fallback) est affiché pour garder un aspect grille parfait
        */}
        {lieu.cover_url ? (
          <Image
            source={{ uri: lieu.cover_url }}
            style={styles.image}
            transition={500}
            contentFit="cover"
            // hash spécifique pour afficher un "flou progressif" type squelette pendant le fetch d'image (Très bonne perf UX)
            placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }} 
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>📷</Text>
          </View>
        )}

        {/* 
          Vérifie l'existence de la prop depuis le state Global (Context).
          Si elle correspond (truthy), monte un Badge Date en position absolute sur la Cover Image.
        */}
        {plannedDate ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🗓️ Prévu le : {formatDate(plannedDate)}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        {/* Nativité : numberOfLines truncate textuellement avec (...) si chaîne trop longue (évite de briser la grid UI) */}
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
    elevation: 3, // Shadowing matériel sur Android
    shadowColor: '#000', // Shadowing matériel sur IOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    position: 'relative', // Essentiel pour le positionnement Absolu du Badge Enfant
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
  badge: {
    position: 'absolute',
    top: 10,  // Placement "Flottant" par rapport à imageWrapper
    right: 10,
    backgroundColor: 'rgba(0, 173, 245, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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