import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function LieuCardSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
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
    <View style={styles.card}>
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
    backgroundColor: '#E1E9EE',
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
