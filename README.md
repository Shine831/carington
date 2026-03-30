<![CDATA[<div align="center">

# 🔴 E-JARNAULD SOFT

### Plateforme IT & Cybersécurité — Douala, Cameroun

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-12.10-orange?logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

**Application web professionnelle pour la gestion d'un cabinet IT spécialisé en cybersécurité, infogérance et infrastructure réseau.**

[🌐 Démo Live](https://ejarnauld-soft.vercel.app) · [📧 Contact](mailto:cust_care@ejs-cm.com)

</div>

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture du projet](#-architecture-du-projet)
- [Installation locale](#-installation-locale)
- [Variables d'environnement](#-variables-denvironnement)
- [Firebase Setup](#-firebase-setup)
- [Déploiement Vercel](#-déploiement-vercel)
- [Sécurité](#-sécurité)
- [Internationalisation](#-internationalisation)
- [Scripts](#-scripts)

---

## ✨ Fonctionnalités

### 🌐 Vitrine publique
- **Page d'accueil** — Hero animé, services phares, témoignages clients (carrousel marquee), CTA
- **Services** — Catalogue dynamique avec recherche en temps réel (alimenté depuis Firestore)
- **À propos** — Présentation de l'entreprise, valeurs, chiffres clés
- **Contact** — Formulaire avec notification email admin (Resend API)
- **Demande de devis** — Formulaire complet avec sélection de service, budget, délai

### 🔐 Espace Client (Dashboard)
- Authentification Email/Password + Google OAuth
- Vérification email obligatoire (clients uniquement)
- Système de **PIN sécurisé** (SHA-256) avec protection brute-force
- Suivi des demandes de devis en temps réel (statut : En attente → En cours → Terminé)
- Gestion des avis clients (créer, modifier, supprimer)
- Modification du profil (nom, email avec re-vérification)
- Changement de mot de passe

### 🛡️ Panel Administrateur
- Tableau de bord avec métriques temps réel (clients, demandes, services, messages)
- **Gestion des services** — CRUD complet (création, modification, suppression)
- **Gestion des demandes** — Changement de statut + notes admin
- **Gestion des messages** — Lecture, marquage, suppression
- **Gestion des avis** — Modération + suppression
- **Gestion des clients** — Vue complète + suppression cascadée
- Authentification PIN Maître (6 chiffres) + auto-déconnexion 30 min
- Changement de mot de passe administrateur

### 🎨 Design & UX
- Design system **"Écarlate"** (Rouge & Blanc)
- Animations Framer Motion (page transitions, parallax, micro-interactions)
- Curseur personnalisé, effets de particules, cards tilt 3D
- Glassmorphism, gradients granuleux, bruit de texture SVG
- **100% Mobile-first responsive** (SVH units)
- Mode offline (Firestore persistence IndexedDB)
- PWA-ready (Web App Manifest)

---

## 🛠 Stack technique

| Couche | Technologie | Version |
|---|---|---|
| **Framework** | Next.js (App Router, Turbopack) | 16.1.7 |
| **UI** | React | 19.2.3 |
| **Langage** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 4.x |
| **Animations** | Framer Motion | 12.38 |
| **Icônes** | Lucide React | 0.577 |
| **Backend** | Firebase (Auth + Firestore) | 12.10 |
| **Email** | Resend API + React Email | 6.9 |
| **Validation** | Zod | 4.3 |
| **Déploiement** | Vercel | — |

---

## 🏗 Architecture du projet

```
src/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx            # Accueil
│   ├── about/              # À propos
│   ├── services/           # Catalogue de services
│   ├── contact/            # Formulaire de contact
│   ├── booking/            # Demande de devis
│   ├── account/            # Connexion / Inscription
│   ├── dashboard/          # Espace client
│   ├── admin/              # Panel administrateur
│   ├── privacy/            # Politique de confidentialité
│   ├── terms/              # Conditions d'utilisation
│   ├── actions/            # Server Actions (email, auth)
│   ├── api/                # API Routes
│   ├── globals.css         # Design system CSS
│   ├── layout.tsx          # Layout racine
│   └── manifest.ts         # PWA Manifest
│
├── components/
│   ├── layout/             # Navbar, Footer, PageTransition
│   ├── ui/                 # Motion, AuraGradient, Testimonials,
│   │                       # InteractiveEffects, ParticleBackground,
│   │                       # CustomCursor, BentoCard
│   ├── Logo.tsx
│   └── FloatingWhatsApp.tsx
│
├── context/
│   ├── LanguageContext.tsx  # Provider i18n (FR/EN)
│   └── translations.ts     # Dictionnaire bilingue complet
│
├── hooks/
│   └── useAuth.ts          # Hook d'authentification Firebase
│
└── lib/
    └── firebase/
        ├── config.ts       # Initialisation Firebase + Persistence
        ├── auth.ts         # Auth (register, login, Google, reset)
        └── db.ts           # Firestore CRUD (services, bookings,
                            # users, messages, reviews, PIN)

scripts/
├── auto-translate.mjs      # Traduction automatique FR → EN (prebuild)
└── translate.mjs           # Utilitaire de traduction

public/
├── images/                 # Assets visuels
├── logo.jpg                # Logo entreprise
├── robots.txt              # SEO
└── sitemap.xml             # Sitemap XML
```

---

## 🚀 Installation locale

### Prérequis
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Un projet **Firebase** configuré (Auth + Firestore)

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/Shine831/carington.git
cd carington

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir .env.local avec vos clés Firebase et Resend

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

---

## 🔑 Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Firebase (obligatoire)
NEXT_PUBLIC_FIREBASE_API_KEY=votre_clé_api
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_projet_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_projet.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Resend Email (optionnel — pour les notifications admin)
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=admin@votredomaine.com
```

> ⚠️ Les fichiers `.env*` sont exclus du Git (`.gitignore`). Ne commitez **jamais** vos clés.

---

## 🔥 Firebase Setup

### 1. Authentication
Activez ces providers dans la console Firebase :
- **Email/Password**
- **Google**

### 2. Firestore Database
Créez une base Firestore en mode **production**. Les collections sont créées automatiquement :

| Collection | Description |
|---|---|
| `users` | Profils utilisateurs (uid, email, role, pin) |
| `services` | Catalogue de services (titre, description, prix, catégorie) |
| `bookings` | Demandes de devis (status, userId, serviceId) |
| `messages` | Messages du formulaire de contact |
| `reviews` | Avis et témoignages clients |

### 3. Firestore Security Rules
Déployez les règles depuis le fichier `firestore.rules` inclus dans le projet :

```bash
# Si vous utilisez Firebase CLI
firebase deploy --only firestore:rules
```

Les règles implémentent :
- Clients : lecture/écriture de leurs propres données uniquement
- Admin : accès complet à toutes les collections
- Services & Reviews : lecture publique
- Messages : création publique (formulaire contact)

### 4. Créer le compte Admin
Créez manuellement un utilisateur dans **Firebase Console → Authentication**, puis ajoutez un document dans **Firestore → users** :

```json
{
  "uid": "FIREBASE_AUTH_UID",
  "email": "admin@votredomaine.com",
  "displayName": "Admin",
  "role": "ADMIN",
  "createdAt": "Timestamp"
}
```

---

## ▲ Déploiement Vercel

### 1. Connecter le repo GitHub
- Importez le projet sur [vercel.com/new](https://vercel.com/new)
- Sélectionnez le repository `carington`

### 2. Configurer les variables d'environnement
Dans **Settings → Environment Variables**, ajoutez toutes les variables de votre `.env.local`.

### 3. Déployer
```bash
git push origin master
```
Vercel détecte automatiquement Next.js et lance le build.

### Build command (automatique)
```
npm run build
```
> Le script `prebuild` exécute la traduction automatique FR → EN avant chaque build.

---

## 🔒 Sécurité

| Mesure | Détail |
|---|---|
| **Authentification** | Firebase Auth (Email/Password + Google OAuth) |
| **Vérification email** | Obligatoire pour les clients, bypass pour les admins |
| **PIN sécurisé** | Hash SHA-256 côté client, stocké dans Firestore |
| **Protection brute-force** | 5 tentatives max + lockout 15 min (PIN) |
| **Rôles** | CLIENT / ADMIN — vérifié côté Firestore Rules |
| **Auto-déconnexion** | Admin : 30 min d'inactivité |
| **Firestore Rules** | Isolation par utilisateur, pas de cross-read |
| **Persistence offline** | Cache IndexedDB local + fallback mémoire serveur |
| **Rate limiting** | Changement de PIN limité à 1x/24h |

---

## 🌍 Internationalisation

L'application est entièrement bilingue **Français / Anglais**.

- **Source de vérité** : les textes en français dans `src/context/translations.ts`
- **Traduction automatique** : le script `prebuild` traduit automatiquement les nouvelles clés FR → EN via Google Translate API
- **Cache de traduction** : `scripts/.translate-cache.json` évite de re-traduire les chaînes déjà traitées
- **Sélecteur de langue** : intégré dans la Navbar (toggle FR/EN)

```bash
# Traduire manuellement
npm run translate
```

---

## 📜 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build production (prebuild + next build) |
| `npm run start` | Serveur de production |
| `npm run lint` | Linting ESLint |
| `npm run translate` | Traduction automatique FR → EN |

---

## 📄 Licence

Ce projet est propriétaire. © 2026 E-JARNAULD SOFT — Tous droits réservés.

---

<div align="center">

**Développé avec ❤️ à Douala, Cameroun**

E-JARNAULD SOFT — *Votre infrastructure, notre expertise.*

</div>
]]>
