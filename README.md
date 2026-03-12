# 🏙️ Urban Explorer - Paris City Guide

## 📖 Présentation
**Urban Explorer** est une application mobile de type "City Guide" centralisée sur la ville de Paris. 
Son but principal est pédagogique : elle permet d'apprendre et de démontrer l'intégration robuste de multiples fonctionnalités natives (Caméra, Géolocalisation, Calendrier) au sein d'une application React Native (Expo) moderne.

## 🏗️ Architecture et Workflow

### 🗺️ Navigation
L'application utilise une approche fluide grâce à `@react-navigation` :
- **Bottom Tab Navigator** : Utilisé pour la navigation principale, offrant un accès permanent aux sections clés de l'application (*Découverte*, *Carte*, *Mon Profil*).
- **Stack Navigator** : Intégré sous l'onglet "Découverte", il permet une navigation empilée pour passer de la liste générale des lieux vers un écran de "Détails" spécifique, avec gestion de l'historique de retour.

### 📂 Arborescence du Projet
Le projet suit une organisation modulaire :
- `src/screens/` : Contient les écrans plein écran principaux de l'application.
- `src/components/` : Regroupe les composants graphiques réutilisables (Boutons, Cartes de lieux, etc.).
- `src/services/` : Isole la logique métier et réseau, notamment les appels API (`api.ts`).
- `src/types/` : Définit les interfaces TypeScript (`Lieu`, `CoordonneesGeo`) pour garantir un typage strict et sécurisé sur l'ensemble du projet.

## 🔌 Détails de l'API : Open Data Paris
Nous consommons l'API publique **Open Data de la Ville de Paris**.
- **Méthode** : Requêtes HTTP `GET` effectuées via `axios`.
- **Gestion de l'État** : Intégration dans les composants React via le hook `useState` (pour conserver les données et le statut de chargement) et déclenché automatiquement au montage grâce à `useEffect`.

## 📱 Composants Natifs & Permissions

L'application exploite le matériel de l'appareil via les outils Expo :

- **📍 Localisation et Carte** : Intégration experte de `react-native-maps` pour afficher une vue cartographique au sein de laquelle nous plaçons des **marqueurs dynamiques** issus des coordonnées lat/lon fournies par l'API.
- **📅 Calendrier** : Utilisation de `expo-calendar` permettant aux utilisateurs de synchroniser les dates et de planifier efficacement leurs visites directement dans l'agenda du téléphone.
- **📸 Caméra** : Déploiement de `expo-camera` dans la section profil pour permettre la capture de selfies, gérant d'abord les prompts de **permissions matérielles** obligatoires côté utilisateur.

## ✨ Bonus Implémentés
Afin d'offrir une expérience utilisateur Premium, plusieurs atouts ont été codés en supplément :
- 🌍 **Géolocalisation Utilisateur** : Permet de centrer la carte sur la véritable position de l'utilisateur grâce à `expo-location`.
- 💾 **Persistance des Données** : Mise en place de `AsyncStorage` pour sauvegarder les préférences utilisateur ou favoris afin d'y accéder même hors connexion.
- 🎨 **Améliorations UI/UX** : Ajout d'indicateurs de chargement (loaders / `ActivityIndicator`) pendant les appels réseau afin que l'interface reste réactive et compréhensible.

---

## 👥 Équipe du Projet

| Rôle | Nom / Pseudonyme | Missions Principales |
| :--- | :--- | :--- |
| 📋 **Product Manager** | *À définir* | Conception, spécifications et Product Backlog |
| 💻 **Lead Developer** | *À définir* | Architecture, intégration Native, API et Typage |
| 🎨 **UI/UX Designer** | *À définir* | Maquettage, design system et interactions |

---

## 🚀 Installation et Lancement

Suivez ces étapes pour exécuter le projet sur votre environnement local.

1. **Installer les dépendances NPM**
```bash
npm install
```

2. **Démarrer le serveur de développement Expo**
```bash
npx expo start
```

*Une fois le serveur lancé, scannez le **QR Code** depuis l'application `Expo Go` sur votre smartphone ou appuyez sur `a` (pour l'émulateur Android) / `i` (pour l'émulateur iOS) depuis votre terminal.*
