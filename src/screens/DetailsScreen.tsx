// 📋 Tâche de Karim — Écran Détails (Fiche lieu + Calendrier)
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import DetailsSkeleton from '../components/DetailsSkeleton';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { lieu } = route.params;

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        {/* Zone image avec skeleton en arrière-plan */}
        {lieu.cover_url ? (
          <View style={styles.imageWrapper}>
            {/* Skeleton visible tant que l'image n'est pas chargée */}
            {!isImageLoaded && (
              <View style={styles.imageSkeleton} />
            )}
            <Animated.View style={[styles.imageContainer, { opacity: isImageLoaded ? fadeAnim : 0 }]}>
              <Image
                source={{ uri: lieu.cover_url }}
                style={styles.image}
                transition={600}
                contentFit="cover"
                onLoad={handleImageLoad}
              />
            </Animated.View>
          </View>
        ) : null}

        <View style={styles.content}>
          <Text style={styles.title}>{lieu.title}</Text>

          <Text style={styles.address}>
            📍 {lieu.address_street}, {lieu.address_zipcode} {lieu.address_city}
          </Text>

          {lieu.address_name ? (
            <Text style={styles.venue}>🏛️ {lieu.address_name}</Text>
          ) : null}

          {lieu.lead_text ? (
            <Text style={styles.lead}>{lieu.lead_text}</Text>
          ) : null}

          {lieu.price_type ? (
            <Text style={styles.price}>
              💰 {lieu.price_type === 'gratuit' ? 'Gratuit' : 'Payant'}
            </Text>
          ) : null}

          {lieu.lat_lon ? (
            <Text style={styles.coords}>
              🌐 Lat: {lieu.lat_lon.lat.toFixed(5)}, Lon: {lieu.lat_lon.lon.toFixed(5)}
            </Text>
          ) : null}

          {lieu.contact_url ? (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(lieu.contact_url!)}
            >
              <Text style={styles.linkText}>🔗 Plus d'infos</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageWrapper: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  imageSkeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E1E9EE',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  address: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
  },
  venue: {
    fontSize: 15,
    color: '#007AFF',
    marginBottom: 12,
  },
  lead: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  price: {
    fontSize: 15,
    color: '#34C759',
    fontWeight: '600',
    marginBottom: 8,
  },
  coords: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 8,
  },
  linkButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  linkText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
