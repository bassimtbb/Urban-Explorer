/**
 * @file DetailsSkeleton.tsx
 * @description Composant Squelette (Skeleton Screen) pour l'écran DetailsScreen.
 * Apporte un feedback visuel premium plutôt qu'un ActivityIndicator basique 
 * pendant que les assets lourds (comme l'image cover_url) chargent.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function DetailsSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  // Animation en boucle (Pulse effect) pour simuler un "chargement actif" continu
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true, // Optimisation thread UI
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Image de couverture en Skeleton */}
      <Animated.View style={[styles.coverImage, { opacity: pulseAnim }]} />

      <View style={styles.content}>
        {/* Blocs fictifs remplaçant le Titre */}
        <Animated.View style={[styles.titleLine, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.titleLineShort, { opacity: pulseAnim }]} />

        {/* Bloc fictif Adresse */}
        <Animated.View style={[styles.addressLine, { opacity: pulseAnim }]} />

        {/* Bloc fictif Lieu / Venue */}
        <Animated.View style={[styles.venueLine, { opacity: pulseAnim }]} />

        {/* Blocs fictifs Description (lead_text) — simulés sur plusieurs lignes */}
        <Animated.View style={[styles.descLine, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.descLine, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.descLineShort, { opacity: pulseAnim }]} />

        {/* Bloc fictif Prix */}
        <Animated.View style={[styles.priceLine, { opacity: pulseAnim }]} />

        {/* Bloc fictif d'un Bouton (Link Button) */}
        <Animated.View style={[styles.buttonLine, { opacity: pulseAnim }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  coverImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E1E9EE', // Couleur grise placeholder
  },
  content: {
    padding: 20,
  },
  titleLine: {
    width: '80%',
    height: 24,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
  },
  titleLineShort: {
    width: '50%',
    height: 24,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 16,
  },
  addressLine: {
    width: '65%',
    height: 15,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 10,
  },
  venueLine: {
    width: '45%',
    height: 15,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 16,
  },
  descLine: {
    width: '100%',
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
  },
  descLineShort: {
    width: '70%',
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 16,
  },
  priceLine: {
    width: '30%',
    height: 15,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 20,
  },
  buttonLine: {
    width: 140, // Forme le placeholder d'un CTA rectangulaire
    height: 44,
    backgroundColor: '#E1E9EE',
    borderRadius: 8,
  },
});
