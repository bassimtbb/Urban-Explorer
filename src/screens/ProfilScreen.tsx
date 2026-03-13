/**
 * @file ProfilScreen.tsx
 * @description Écran du profil utilisateur permettant de gérer un avatar.
 * Intègre la prise de photo via la Caméra et la sélection depuis la Galerie.
 * Gère la demande de permissions requises et utilise `AsyncStorage` pour la persistance de l'avatar.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé utilisée pour stocker de de manière persistante l'URI de l'avatar dans le cache local
const AVATAR_LOCATION_KEY = '@avatar_uri';

export default function ProfilScreen() {
  // State local qui conserve l'URI de l'image (soit null, soit un string commençant par file://)
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  /**
   * À l'initialisation de la vue, tente de récupérer l'avatar précédemment 
   * sauvegardé dans l'AsyncStorage de l'appareil.
   */
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const savedUri = await AsyncStorage.getItem(AVATAR_LOCATION_KEY);
        // Si on a bien récupéré une URI, on met à jour le State pour l'afficher
        if (savedUri !== null) {
          setAvatarUri(savedUri);
        }
      } catch (e) {
        console.error('Erreur de chargement avatar', e);
      }
    };
    loadAvatar();
  }, []);

  /**
   * Fonction utilitaire pour sauvegarder la nouvelle URI d'image localement.
   * Mets à jour AsyncStorage ET le State React simultanément.
   * Si "null" est passé, cela signifie une suppression et on nettoie l'AsyncStorage.
   * 
   * @param uri L'URI locale de la photo, ou null pour effacer l'avatar
   */
  const saveAvatar = async (uri: string | null) => {
    try {
      if (uri) {
        await AsyncStorage.setItem(AVATAR_LOCATION_KEY, uri);
      } else {
        await AsyncStorage.removeItem(AVATAR_LOCATION_KEY);
      }
      setAvatarUri(uri);
    } catch (e) {
      console.error('Erreur sauvegarde avatar', e);
    }
  };

  /**
   * Gère la capture d'un Selfie.
   * 1. Demande les permissions Caméra au système d'exploitation natif.
   * 2. Ouvre l'interface Caméra native restreinte à la face avant (selfie).
   * 3. Récupère le résultat natif et sauvegarde l'image.
   */
  const handleTakeSelfie = async () => {
    // Demande au niveau système d'accéder à l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        '📷 Permission requise',
        "L'accès à la caméra est nécessaire pour prendre votre photo de profil. Veuillez l'activer dans les réglages.",
        [{ text: 'OK' }]
      );
      return;
    }

    // Le wrapper ImagePicker ouvre la Caméra.
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true, // Laisse l'utilisateur rogner/recadrer l'image nativement
      aspect: [1, 1], // Format Carré
      quality: 0.8, // Compression pour optimisation de l'espace local
      cameraType: ImagePicker.CameraType.front, // Oblige la caméra frontale par défaut
    });

    // Si la capture n'a pas été annulée et que l'image est valide : on sauvegarde
    if (!result.canceled && result.assets[0]) {
      saveAvatar(result.assets[0].uri);
    }
  };

  /**
   * Identique à handleTakeSelfie, mais pour la Galerie photo (Pellicule).
   * 1. Demande la permission à la photothèque système.
   * 2. Ouvre l'UI de sélection native.
   * 3. Récupère le résultat.
   */
  const handlePickFromGallery = async () => {
    // Demande d'accès MediaLibrary
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        '🖼️ Permission requise',
        "L'accès à la galerie est nécessaire pour choisir une photo. Veuillez l'activer dans les réglages.",
        [{ text: 'OK' }]
      );
      return;
    }

    // Ouvre le sélecteur natif (Photos Picker sur iOS / Files sur Android)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, 
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      saveAvatar(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Encart Avatar circulaire */}
        <View style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
              transition={500}
              contentFit="cover"
            />
          ) : (
            // Placeholder si pas d'image
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={60} color="#C7C7CC" />
            </View>
          )}

          {/* Badge interactif cliquable ouvrant la Caméra rapidement */}
          <TouchableOpacity style={styles.cameraBadge} onPress={handleTakeSelfie}>
            <Ionicons name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>Urban Explorer</Text>
        <Text style={styles.subtitle}>Explorateur parisien 🗼</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleTakeSelfie}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Prendre un selfie</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handlePickFromGallery}>
            <Ionicons name="images-outline" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Choisir depuis la galerie</Text>
          </TouchableOpacity>

          {/* S'il y a déjà un avatar sélectionné, bouton de destruction */}
          {avatarUri && (
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() =>
                Alert.alert('Supprimer la photo', 'Voulez-vous supprimer votre photo de profil ?', [
                  { text: 'Non', style: 'cancel' },
                  // On passe null au state/AsyncStorage
                  { text: 'Oui', style: 'destructive', onPress: () => saveAvatar(null) },
                ])
              }
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.dangerButtonText}>Supprimer la photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70, // Arrondi parfait
    borderWidth: 3,
    borderColor: '#00adf5',
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F2F2F7',
    borderWidth: 3,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#00adf5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 32,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12, // Remplacera utilement plusieurs margin dans la nouvelle version RN
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    gap: 8,
  },
  dangerButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});
