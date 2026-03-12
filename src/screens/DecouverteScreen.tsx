import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchLieux } from '../services/api';
import { Lieu } from '../types';
import LieuCard from '../components/LieuCard';

export default function DecouverteScreen() {

  const navigation = useNavigation<any>();

  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLieux = async () => {
      try {
        const data = await fetchLieux();
        setLieux(data);
      } catch (err) {
        setError("Erreur lors du chargement des lieux");
      } finally {
        setLoading(false);
      }
    };

    loadLieux();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Chargement des lieux...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={lieux}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <LieuCard
          lieu={item}
          onPress={() => navigation.navigate('Details', { lieu: item })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});