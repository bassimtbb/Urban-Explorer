/**
 * @file LieuCardSkeleton.tsx
 * @description Composant visuel imitant la forme d'un LieuCard. 
 * Utilisé pendant les phases de chargement (isLoading) pour conserver 
 * la fluidité de l'interface en trompant l'œil de l'utilisateur. 
 * Intègre une animation Animated (Boucle) "Pulse" typique des apps natives.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function LieuCardSkeleton() {
  // Constante mutable (useRef) : Crée une valeur animée stockée en référence (performance++)
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Déclare une Animation Native : Loop sur une Séquence
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7, // Éclaircie
          duration: 800, // En 0.8sec
          useNativeDriver: true, // thread graphique
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3, // Assombrissement 
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    // Au montage démarrage de l'anim
    animation.start();
    // Au démontage du composant (cleanup component), garbage collector stop de la frame.
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    // Les View classiques de layout sont conservées (Card, content)...
    <View style={styles.card}>
      {/* ...mais l'intérieur de ces views (imagePlaceholder, titleLine) sont des Animated.View 
          liées au hook `pulseAnim` gérant dynamiquement leur paramètre {opacity} ! */}
      <Animated.View style={[styles.imagePlaceholder, { opacity: pulseAnim }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.titleLine, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.addressLine, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.leadLine, { opacity: pulseAnim }]} />
      </View>
    </View>
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
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#E1E9EE', // Couleur du skeleton de base
  },
  content: {
    padding: 14,
  },
  titleLine: {
    width: '70%',
    height: 18,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 10,
  },
  addressLine: {
    width: '50%',
    height: 13,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 10,
  },
  leadLine: {
    width: '90%',
    height: 13,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
});
