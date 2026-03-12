// 📋 Tâche de Karim — Écran Détails (Fiche lieu + Calendrier)
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Animated, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useVisits } from '../contexts/VisitContext';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const route = useRoute<DetailsScreenRouteProp>();
  const { lieu } = route.params;
  const { planVisit, cancelVisit, getPlannedDate } = useVisits();

  // --- Image loading ---
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

  // --- Calendrier ---
  const existingDate = getPlannedDate(lieu.id);
  const [selectedDate, setSelectedDate] = useState(existingDate || '');

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    planVisit(lieu.id, day.dateString, lieu);
  };

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
            cancelVisit(lieu.id);
            setSelectedDate('');
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    const [year, month, dayNum] = dateStr.split('-');
    return `${dayNum}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== Image de couverture ===== */}
        {lieu.cover_url ? (
          <View style={styles.imageWrapper}>
            {!isImageLoaded && <View style={styles.imageSkeleton} />}
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

        {/* ===== Informations du lieu ===== */}
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

          {/* ===== Section Calendrier ===== */}
          <View style={styles.calendarSection}>
            <Text style={styles.calendarTitle}>📅 Planifier une visite</Text>

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
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 15,
                textMonthFontSize: 17,
                textDayHeaderFontSize: 13,
              }}
              style={styles.calendar}
            />

            {selectedDate ? (
              <>
                <View style={styles.confirmationBox}>
                  <Text style={styles.confirmationIcon}>✅</Text>
                  <Text style={styles.confirmationText}>
                    Visite au <Text style={styles.confirmationBold}>{lieu.title}</Text> planifiée le{' '}
                    <Text style={styles.confirmationBold}>{formatDate(selectedDate)}</Text>
                  </Text>
                </View>

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
