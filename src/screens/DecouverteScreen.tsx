/**
 * @file DecouverteScreen.tsx
 * @description Écran principal listant les lieux culturels parisiens. 
 * Inclut une barre de recherche pour un filtrage dynamique en temps réel.
 */
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchLieux } from '../services/api';
import { Lieu } from '../types';
import { useVisits } from '../contexts/VisitContext';
import LieuCard from '../components/LieuCard';
import ErrorState from '../components/ErrorState';

export default function DecouverteScreen() {
  const navigation = useNavigation<any>();
  const { getPlannedDate } = useVisits();

  // State pour stocker la liste globale des lieux récupérés de l'API
  const [lieux, setLieux] = useState<Lieu[]>([]);
  // State pour stocker la saisie textuelle de l'utilisateur dans la barre de recherche
  const [searchQuery, setSearchQuery] = useState('');
  // State booléen contrôlant l'affichage du spinner d'ActivityIndicator
  const [isLoading, setIsLoading] = useState(true);
  // State pour conserver et afficher le message d'erreur éventuel lors du fetch
  const [error, setError] = useState('');
  
  // Valeur animée gérant l'opacité pour un fondu (fade-in) visuel lors de l'apparition de la liste
  const fadeAnim = useState(new Animated.Value(0))[0];

  /**
   * Effectue la requête HTTP vers l'API lors de l'initialisation (montage) du composant.
   * Appelle `fetchLieux` et stocke le résultat dans le State `lieux`.
   */
  useEffect(() => {
    const loadLieux = async () => {
      try {
        const data = await fetchLieux();
        setLieux(data); // La mise à jour du state déclenche le re-rendu et alimente la FlatList
      } catch (err) {
        setError('Erreur lors du chargement des lieux'); // Définition du fallback d'erreur
      } finally {
        setIsLoading(false); // Stoppe le composant de chargement
        // Démarre l'animation d'opacité (0 à 1) de la liste pour l'UX
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true, // Utilisation du thread natif pour une animation fluide
        }).start();
      }
    };

    loadLieux();
  }, []);

  /**
   * Logique de filtrage en temps réel (Search Bar / Bonus).
   * Utilise `useMemo` pour ne recalculer le tableau des résultats filtrés que 
   * lorsque `lieux` ou `searchQuery` change, améliorant ainsi les performances.
   */
  const filteredLieux = useMemo(() => {
    // Si la recherche est vide, on retourne la liste complète
    if (!searchQuery.trim()) return lieux;
    
    const lowerQuery = searchQuery.toLowerCase();
    
    // Filtre la liste des lieux : on vérifie si le titre ou le 'nom_usuel' du lieu
    // contient la sous-chaîne saisie par l'utilisateur.
    return lieux.filter(
      (lieu) =>
        lieu.title.toLowerCase().includes(lowerQuery) ||
        (lieu as any).nom_usuel?.toLowerCase().includes(lowerQuery)
    );
  }, [lieux, searchQuery]);

  // Si on attrape une erreur API, on rend le composant d'erreur spécifique
  if (error) {
    return <ErrorState message={error} icon="cloud-offline-outline" />;
  }

  // Pendant le `fetch`, le booléen `isLoading` est true : affichage d'un spinner
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des lieux...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
      {/* 
        Composant de saisie (SearchBar) liée au useState `searchQuery`. 
        Chaque frappe déclenche `onChangeText` et recalcule `filteredLieux`.
      */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un lieu..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing" // iOS seulement: permet d'effacer la saisie d'un clic
        />
      </View>

      {/* 
        Validation après le tri : Si la fonction filter n'a retourné aucun lieu (length === 0),
        on affiche le Fallback d'erreur de recherche vide au lieu d'un écran blanc.
      */}
      {filteredLieux.length === 0 ? (
        <ErrorState message="Aucun lieu trouvé pour votre recherche." icon="search-outline" />
      ) : (
        /*
          Composant FlatList natif et performant pour rendre le tableau filtré.
          `renderItem` reconstruit chaque noeud via le Custom Component `LieuCard`.
        */
        <FlatList
          data={filteredLieux}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <LieuCard
              lieu={item}
              plannedDate={getPlannedDate(item.id)}
              /* 
                Navigation : En cliquant sur la carte, on utilise navigation.navigate('Details')
                et on injecte l'objet global `item` (Lieu) directement dans l'attribut `params`.
              */
              onPress={() => navigation.navigate('Details', { lieu: item })}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16, // Compatible nouvelle architecture (attributs numériques standardisés)
    color: '#1C1C1E',
    height: '100%',
  },
});