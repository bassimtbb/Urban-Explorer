// 📋 Tâche de Mohamed — Écran Découverte (liste des lieux)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchLieux } from '../services/api';
import { Lieu } from '../types';
import LieuCard from '../components/LieuCard';
import LieuCardSkeleton from '../components/LieuCardSkeleton';

export default function DecouverteScreen() {
  const navigation = useNavigation<any>();

  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const loadLieux = async () => {
      try {
        const data = await fetchLieux();
        setLieux(data);
      } catch (err) {
        setError('Erreur lors du chargement des lieux');
      } finally {
        setIsLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
    };

    loadLieux();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        {[1, 2, 3, 4, 5].map((key) => (
          <LieuCardSkeleton key={key} />
        ))}
      </View>
    );
  }

  return (
    <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
      <FlatList
        data={lieux}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <LieuCard
            lieu={item}
            onPress={() => navigation.navigate('Details', { lieu: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  listContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
});