# 🗼 Urban Explorer - City Guide Paris

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**Urban Explorer** est une application mobile *City Guide* innovante permettant de découvrir les lieux culturels et les événements incontournables de la ville de Paris. L'application exploite en temps réel les données de l'API Open Data de Paris pour offrir une expérience ludique, interactive et géolocalisée.

Ce projet correspond au **TP Final** de développement mobile (React Native / Expo), prouvant l'acquisition et la maîtrise avancée des concepts cruciaux de développement (Architecture, Navigation, Fetching, UX, et APIs Natives).

---

## 🏗️ Architecture du Projet (Étape 1)

Le projet respecte scrupuleusement les standards de qualité de l'écosystème React Native.

### Découpage Modulaire

Le code source s'organise autour d'un dossier `src/` :
- 📁 **/screens** : Les écrans de l'application (`Decouverte`, `Carte`, `Details`, `Planning`, `Profil`).
- 📁 **/components** : Les composants UI réutilisables (`LieuCard`, `ErrorState`, composants Skeleton).
- 📁 **/services** : La logique métier et réseau externe, notamment `api.ts` (fetch avec Axios).
- 📁 **/types** : Centralisation des interfaces et des types TypeScript (`index.ts`).
- 📁 **/contexts** : Gestion d'état global avec React Context (`VisitContext`).

### Système de Navigation

La navigation s'articule via **React Navigation v6** autour de deux paradigmes principaux :
- **Bottom Tab Navigator** : Le menu principal offrant l'accès racine aux sections "Découverte" (Liste), "Carte" (Map), "Mes Visites" (Planning global), et "Profil" (Avatar / Selfie).
- **Stack Navigator** : Imbriqué à l'intérieur de l'onglet "Découverte", il prend en charge le parcours *Liste (DecouverteScreen) -> Détails (DetailsScreen)* tout en créant automatiquement les comportements de retour écran (Back button).

---

## 🛠️ Spécifications Techniques (Étapes 2 & 3)

### 📡 Consommation d'API
- Intégration de l'**API REST Open Data de Paris** (Dataset *"Que faire à Paris"*).
- Limitation optimisée à **30 records** fetchés dynamiquement via `axios`.
- Gestion asynchrone sécurisée par le pattern classique `useState` / `useEffect` :
  - `isLoading` pour afficher l'attente (ActivityIndicator).
  - Gestion rigoureuse des cas d'erreur API (`fallbackError`).

### 🗺️ Cartographie & Géolocalisation
- Module **`react-native-maps`** pour le rendu complet du composant Plan.
- Le viewport par défaut centre la carte sur **Paris**.
- Les données de lieux ayant des informations GPS formatées (`coordonnees_geo`) sont modélisées interactivement (Points d'intérêts Custom via les `Markers`).
- La page affiche des Callouts customisables et cliquables permettant de `navigate` avec le `params: lieu`.

### 📅 Planification Interactive
- Module **`react-native-calendars`** intégré statiquement dans la fiche `<DetailsScreen>`.
- L'utilisateur peut cliquer un jour à sa convenance pour booker sa visite. 
- La sélection est transformée en **State local** et transmise au Contexte global pour affichage d'une popup confirmatoire avec date formattée de type DD/MM/YYYY.

### 📸 Multimédia et Avatar
- Utilisation des APIs directives du Device : **`expo-image-picker`**.
- La page Profil expose deux boutons pour capturer un « Selfie » interactif en face cam (`CameraType.front`) ou Piocher dans la Galerie photo système.
- Validation des autorisations utilisateur (`permissions = granted`) de l'OS.
- L'image résultante est conservée comme « Avatar ».

---

## 🚀 Bonus Implémentés

Pour professionnaliser l'expérience utilisateur, les bonus suivants ont été conçus et prouvés fonctionnels :

1. **🌍 Géolocalisation Live (`expo-location`)**
   - Demande de permission et capture GPS `getCurrentPositionAsync()`. L'écran `CarteScreen` suit le point bleu nativement de l'utilisateur.

2. **💾 Persistance des Données Local (`AsyncStorage`)**
   - Implémenté pour assurer qu'une visite *"Planifiée"* dans le `VisitContext` persiste même après redémarrage logiciel de l'application mobile.
   - Concerne également **l'Avatar Selfie** enregistré !

3. **🔍 Barre de Recherche en Temps Réel**
   - Hook `useMemo` gérant instantanément les Input de recherche pour filtrer un tableau de données local par `tite` ou `nom_usuel` sans avoir à relancer le Fetch de l'API.

4. **✨ UX Avancée & Skeleton Loaders**
   - Remplacement des Views banales avec des `ActivityIndicator` natifs.
   - Présence de Squelettes de charge (Skeletons Animated Loops) et de pages distinctes (`ErrorState`) avec icônes illustrant une API échouée ou un Array vide.

---

## ⚙️ Installation et Lancement Rapide

Vous aurez besoin de NodeJS 18+ ou équivalent.

```bash
# Clone the repository (si vous l'avez upload sur git)
git clone https://github.com/bassimtbb/Urban-Explorer.git

# Install dependencies localement
npm install

# Start the Expo Metro Server !
npx expo start
# Utilisez votre téléphone caméra (Expo Go) ou pressez "a" pour Android Emulator ou "i" pour Ios Simulator
```

### 📦 Dépendances Clés utilisées

```json
  "@react-native-async-storage/async-storage": "^2.1.2",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "@react-navigation/native": "^7.0.14",
  "@react-navigation/stack": "^7.1.1",
  "axios": "^1.8.1",
  "expo": "~52.0.36",
  "expo-image": "~2.0.6",
  "expo-image-picker": "~16.0.6",
  "expo-location": "~18.0.6",
  "react-native-calendars": "^1.1308.1",
  "react-native-maps": "1.18.0",
```

---

*City Guide réalisé avec passion et React Native.* 🗼
