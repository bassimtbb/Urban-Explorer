/**
 * @file CarteScreen.tsx
 * @description Écran de gestion de la localisation et affichage des marqueurs sur une carte interactive.
 * Utilise `expo-location` pour centrer la carte sur la position de l'utilisateur.
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { fetchLieux } from '../services/api';
import { Lieu } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type CarteNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

/**
 * Coordonnées par défaut centrées sur Paris, utilisées comme fallback 
 * si la géolocalisation de l'utilisateur n'est pas disponible.
 */
const PARIS_REGION: Region = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function CarteScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CarteNavigationProp>();
  
  // State pour stocker la liste des lieux récupérés depuis l'API
  const [lieux, setLieux] = useState<Lieu[]>([]);
  // State pour gérer l'affichage du spinner de chargement
  const [isLoading, setIsLoading] = useState(true);
  // State pour la région affichée sur la carte, initialisée sur Paris
  const [region, setRegion] = useState<Region>(PARIS_REGION);

  /**
   * Initialise la carte lors du premier rendu du composant.
   * Cette fonction gère séquentiellement la demande de permission de localisation,
   * la récupération de la position de l'utilisateur, et le fetch des lieux depuis l'API.
   */
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Demande de permission à l'utilisateur pour accéder à sa localisation en arrière-plan et au premier plan
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          // Si accordé, on récupère les coordonnées GPS actuelles
          const location = await Location.getCurrentPositionAsync({});
          // Mise à jour de la région de la carte pour centrer sur l'utilisateur
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.08, // Niveau de zoom approprié
            longitudeDelta: 0.08,
          });
        }
      } catch (error) {
        console.error('Erreur de géolocalisation:', error);
      }

      try {
        // Appel de la fonction fetchLieux pour interroger l'API Open Data Paris
        const data = await fetchLieux();
        // Sauvegarde des résultats dans le state `lieux`, déclenchant un re-rendu
        setLieux(data);
      } catch (err) {
        console.error('Erreur chargement carte:', err);
      } finally {
        // Le chargement est terminé qu'il y ait eu une erreur ou non
        setIsLoading(false);
      }
    };

    initializeMap();
  }, []);

  // Affichage d'un ActivityIndicator pendant la récupération initiale des données
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
      {/* 
        Le composant MapView affiche la carte. 
        `initialRegion` détermine le centre et le zoom initiaux.
        `showsUserLocation` affiche le point bleu natif de géolocalisation.
      */}
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* 
          Boucle .map() sur les lieux pour les afficher comme des marqueurs (Marker) sur la carte.
          Un filtre préalable (.filter) s'assure que le lieu possède bien des coordonnées (lat_lon).
        */}
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
              {/* 
                Callout personnalisé affiché quand l'utilisateur clique sur le marqueur.
                Le onPress utilise `navigation.navigate` pour rediriger vers la page Détails,
                en passant l'objet `lieu` complet comme paramètre (Params) de la route.
              */}
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
