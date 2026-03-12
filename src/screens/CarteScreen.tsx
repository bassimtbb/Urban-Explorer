// 📋 Tâche de Celia — Écran Carte (Géolocalisation & Marqueurs)
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchLieux } from '../services/api';
import { Lieu } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type CarteNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

const PARIS_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function CarteScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CarteNavigationProp>();
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLieux = async () => {
      try {
        const data = await fetchLieux();
        setLieux(data);
      } catch (err) {
        console.error('Erreur chargement carte:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLieux();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapView
        style={styles.map}
        initialRegion={PARIS_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {lieux
          .filter((lieu) => lieu.lat_lon !== null && lieu.lat_lon !== undefined)
          .map((lieu, index) => (
            <Marker
              key={lieu.id || index.toString()}
              coordinate={{
                latitude: lieu.lat_lon!.lat,
                longitude: lieu.lat_lon!.lon,
              }}
            >
              <Callout
                onPress={() =>
                  (navigation as any).navigate('DecouverteStack', {
                    screen: 'Details',
                    params: { lieu },
                  })
                }
                tooltip={false}
              >
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle} numberOfLines={2}>
                    {lieu.title}
                  </Text>
                  <Text style={styles.calloutAddress} numberOfLines={1}>
                    📍 {lieu.address_street}, {lieu.address_zipcode}
                  </Text>
                  {lieu.price_type ? (
                    <Text style={styles.calloutPrice}>
                      {lieu.price_type === 'gratuit' ? '🟢 Gratuit' : '🟠 Payant'}
                    </Text>
                  ) : null}
                  <Text style={styles.calloutCta}>Voir les détails →</Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#8E8E93',
  },
  callout: {
    width: 220,
    padding: 10,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  calloutPrice: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  calloutCta: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 4,
  },
});
