/**
 * @file DetailsScreen.tsx
 * @description Écran des détails d'un lieu, présentant ses informations complètes 
 * (description, contacts) et proposant un Calendrier pour planifier une visite.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Animated, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useVisits } from '../contexts/VisitContext';

// Typage des propriétés de la route attendues par GetParams de react-navigation
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  // `useRoute` permet de récupérer l'objet `lieu` passé en paramètre lors de l'appel `navigation.navigate()`
  const route = useRoute<DetailsScreenRouteProp>();
  const { lieu } = route.params; // Objet source venant de la liste des lieux
  
  // Custom hook du contexte VisitContext exposant les méthodes de gestion de mémoire (AsyncStorage)
  const { planVisit, cancelVisit, getPlannedDate } = useVisits();

  // State local pour valider le chargement effectif de l'image de couverture avant animation
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

  /** --- Gestionnaire du Calendrier --- */
  
  // On récupère une éventuelle date de visite pour le lieu actuel
  const existingDate = getPlannedDate(lieu.id);
  // State pour gérer quelle date est cliquée sur le composant `<Calendar>`
  const [selectedDate, setSelectedDate] = useState(existingDate || '');

  /**
   * Fonction exécutée au clic sur un jour dans le `<Calendar>`.
   * Elle met à jour le State local `selectedDate` et utilise la méthode `planVisit`
   * du contexte pour consigner (persister) cette planification globalement et asynchrone.
   * @param day Objet formaté provenant du composant Calendar
   */
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    planVisit(lieu.id, day.dateString, lieu);
  };

  /**
   * Logique de suppression d'une visite.
   * Utilise `Alert.alert` (module natif) pour exiger une confirmation utilisateur.
   * Mettra à jour le Contexte (`cancelVisit`) et réinitialisera l'UI Calendrier (`setSelectedDate('')`).
   */
  const handleDeletePlanification = () => {
    Alert.alert(
      '🗑️ Annuler la visite',
      `Voulez-vous vraiment annuler la visite planifiée au ${lieu.title} ?`,
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => {
            cancelVisit(lieu.id); // Suppression du Global Storage (AsyncStorage derrière)
            setSelectedDate('');  // Mise à jour de l'UI (Désélection visuelle de la date)
          },
        },
      ]
    );
  };

  /** 
   * Fonction simple pour formater temporellement YYYY-MM-DD => DD/MM/YYYY 
   * */
  const formatDate = (dateStr: string) => {
    const [year, month, dayNum] = dateStr.split('-');
    return `${dayNum}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Affichage adaptatif de l'image de couverture si elle est communiquée par l'API */}
        {lieu.cover_url ? (
          <View style={styles.imageWrapper}>
            {!isImageLoaded && <View style={styles.imageSkeleton} />}
            <Animated.View style={[styles.imageContainer, { opacity: isImageLoaded ? fadeAnim : 0 }]}>
              {/* Le composant Image d'expo-image gère efficacement un cache persistant lourd pour ne pas retélécharger la ressource */}
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

          {/* S'il y a un lien direct vers l'office du tourisme de Paris, utilisation du `Linking` natif */}
          {lieu.contact_url ? (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(lieu.contact_url!)}
            >
              <Text style={styles.linkText}>🔗 Plus d'infos</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.calendarSection}>
            <Text style={styles.calendarTitle}>📅 Planifier une visite</Text>
            
            {/* 
              Module Calendrier Custom permettant la programmation d'évènements.
              `markedDates` indique au calendrier quel jour est affiché en subrillance.
            */}
            <Calendar
              onDayPress={handleDayPress}
              markedDates={
                selectedDate
                  ? {
                      [selectedDate]: {
                        selected: true,
                        selectedColor: '#00adf5',
                        selectedTextColor: '#ffffff',
                      },
                    }
                  : {}
              }
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                todayTextColor: '#00adf5',
                arrowColor: '#00adf5',
                selectedDayBackgroundColor: '#00adf5',
                selectedDayTextColor: '#ffffff',
                dotColor: '#00adf5',
                monthTextColor: '#1C1C1E',
                textMonthFontWeight: '700', // Chaîne de caractères string : compatible nouvelle architecture (Fabric)
                textDayHeaderFontWeight: '600',
                textDayFontSize: 15,
                textMonthFontSize: 17,
                textDayHeaderFontSize: 13,
              }}
              style={styles.calendar}
            />

            {/* 
              Ternaire : Si une date est enregistrée, on remplace le "Hint" par 
              un Box Confirmatoire validant la planification (persistance AsyncStorage validée ou chargée).
            */}
            {selectedDate ? (
              <>
                <View style={styles.confirmationBox}>
                  <Text style={styles.confirmationIcon}>✅</Text>
                  <Text style={styles.confirmationText}>
                    Visite au <Text style={styles.confirmationBold}>{lieu.title}</Text> planifiée le{' '}
                    <Text style={styles.confirmationBold}>{formatDate(selectedDate)}</Text>
                  </Text>
                </View>

                {/* Bouton de suppression de la planification */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeletePlanification}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Annuler la visite</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.calendarHint}>
                Sélectionnez une date pour planifier votre visite
              </Text>
            )}
          </View>
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
    fontWeight: '700', // Important: String type pour compatible Fabric framework
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
  calendarSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  calendarHint: {
    marginTop: 16,
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  confirmationBox: {
    marginTop: 16,
    backgroundColor: '#E8F8EE',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  confirmationText: {
    fontSize: 15,
    color: '#1C1C1E',
    flex: 1,
    lineHeight: 22,
  },
  confirmationBold: {
    fontWeight: '700',
    color: '#00adf5',
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '700',
  },
});
