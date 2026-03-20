# 🛡️ Carrington Elite - Agence de Résilience Digitale 2026

**Carrington** est une plateforme Next.js 14+ haute performance conçue pour une agence d'ingénierie IT et de cybersécurité basée au Cameroun. Elle incarne l'alliance entre un design futuriste (Glassmorphism, Micro-animations) et une robustesse technique de classe mondiale.

## 🚀 Fonctionnalités Clés

### 🌍 Expérience Bilingue Intégrale (i18n)
Système d'internationalisation natif gérant le Français et l'Anglais sur l'intégralité du site :
- Bascule instantanée de la langue sans rechargement de page.
- Dashboards Administrateur et Client 100% localisés.

### 🔐 Architecture de Sécurité Avancée
- **Gestion de Compte Autonome** : Les utilisateurs et administrateurs gèrent leurs profils (Nom, Email) de manière sécurisée.
- **Double Protection PIN** : 
    - Master PIN à 6 chiffres pour l'administration.
    - Code PIN à 4 chiffres pour les clients.
- **Authentification Robuste** : Intégration Firebase Auth avec flux de ré-authentification pour les actions sensibles.

### 📊 Tableaux de Bord Premium
- **Client** : Suivi des devis en temps réel et gestion autonome des témoignages (CRUD complet).
- **Admin** : Gestion centralisée des demandes, des messages, du catalogue de services et des comptes utilisateurs.
- **Responsive Design** : Expérience "Mobile-First" optimisée pour tous les terminaux (iOS/Android/Desktop).

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Vanilla CSS + Tailwind Core + Framer Motion (Animations spatiales)
- **Base de données** : Firebase Firestore (NoSQL)
- **Authentification** : Firebase Auth (Identity Platform)
- **i18n** : Context API custom pour une performance maximale

## 📦 Installation & Déploiement

1. **Clonage & Dépendances** :
   ```bash
   git clone [url-du-repo]
   npm install
   ```

2. **Variables d'Environnement** :
   Créez un fichier `.env.local` avec vos clés Firebase :
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   ...
   ```

3. **Build de Production** :
   ```bash
   npm run build
   ```

4. **Déploiement Vercel** :
   Le projet est optimisé pour un déploiement "Zero-Config" sur Vercel. Connectez simplement votre dépôt GitHub.

## 📐 Design & UX
Le design suit les dernières tendances **"High-Tech 2026"** :
- **Glassmorphism** : Effets de flou et de transparence sur les composants.
- **Aura Gradients** : Fonds dynamiques et gradients satinés.
- **Micro-interactions** : Retours visuels tactiles sur chaque bouton et champ de saisie.

---
*Propulsé par l'excellence technique de Carrington Elite.*
