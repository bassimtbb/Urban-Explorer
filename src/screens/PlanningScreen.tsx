// 📋 Écran Mes Visites — Liste des planifications
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useVisits } from '../contexts/VisitContext';

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export default function PlanningScreen() {
  const navigation = useNavigation<any>();
  const { getAllPlannedVisits, cancelVisit } = useVisits();
  const visits = getAllPlannedVisits();

  const handleDelete = (lieuId: string, title: string) => {
    Alert.alert(
      '🗑️ Annuler la visite',
      `Voulez-vous vraiment annuler la visite au ${title} ?`,
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: () => cancelVisit(lieuId),
        },
      ]
    );
  };

  if (visits.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🗓️</Text>
        <Text style={styles.emptyTitle}>Aucune visite planifiée</Text>
        <Text style={styles.emptySubtitle}>
          Explorez Paris pour en ajouter !
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>Mes Visites ({visits.length})</Text>
      <FlatList
        data={visits}
        keyExtractor={(item) => item.lieu.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() =>
              (navigation as any).navigate('DecouverteStack', {
                screen: 'Details',
                params: { lieu: item.lieu },
              })
            }
          >
            {/* Miniature */}
            <Image
              source={{ uri: item.lieu.cover_url || `https://picsum.photos/100?random=${item.lieu.id}` }}
              style={styles.thumbnail}
              transition={400}
              contentFit="cover"
            />

            {/* Infos */}
            <View style={styles.info}>
              <Text style={styles.rowTitle} numberOfLines={2}>
                {item.lieu.title}
              </Text>
              <Text style={styles.rowAddress} numberOfLines={1}>
                📍 {item.lieu.address_street}
              </Text>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>
                  🗓️ {formatDate(item.date)}
                </Text>
              </View>
            </View>

            {/* Bouton supprimer */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.lieu.id, item.lieu.title)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 3,
  },
  rowAddress: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 6,
  },
  dateBadge: {
    backgroundColor: 'rgba(0, 173, 245, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00adf5',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});
