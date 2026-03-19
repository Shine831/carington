<div align="center">
  <h1>⚡ E-JARNAULD SOFT</h1>
  <p><strong>IT Management & Cybersecurity Platform — Douala, Cameroun</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/TailwindCSS-v3-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel" />
  </p>
</div>

---

## 📋 Table des Matières

1. [Présentation](#-présentation)
2. [Stack Technique](#-stack-technique)
3. [Architecture & RBAC](#-architecture--rbac)
4. [Installation](#-installation)
5. [Configuration Firebase (.env)](#-configuration-firebase-env)
6. [Structure du Projet](#-structure-du-projet)
7. [Règles Firestore (Sécurité)](#-règles-firestore-sécurité)
8. [Déploiement Vercel](#-déploiement-vercel)
9. [SEO & Performances](#-seo--performances)

---

## 🚀 Présentation

**E-JARNAULD SOFT** est une plateforme web B2B de management IT construite pour un cabinet informatique basé à Douala (Cameroun). Elle permet :

- **Aux Clients** : S'inscrire, demander des devis, suivre leurs interventions IT, laisser des avis.
- **Aux Admins** : Gérer les services proposés, traiter les demandes clients, gérer les comptes et modérer les avis.

Le design suit les tendances "Premium 2026" : glassmorphism, animations Framer Motion 60 FPS, dark mode, et une expérience mobile-first.

---

## 🛠 Stack Technique

| Technologie | Rôle |
|---|---|
| **Next.js 15** (App Router) | Framework React fullstack |
| **TypeScript 5** | Typage fort |
| **Tailwind CSS v3** | Styling utilitaire |
| **Framer Motion** | Animations & transitions |
| **Firebase Auth** | Authentification (Email + Google OAuth) |
| **Cloud Firestore** | Base de données NoSQL temps réel |
| **Lucide React** | Icônes |
| **Vercel** | Hébergement & CI/CD |

---

## 🔐 Architecture & RBAC

### Rôles Utilisateurs

| Action | Client | Admin |
|---|:---:|:---:|
| Consulter la page d'accueil & services | ✅ | ✅ |
| Créer un compte (email vérifié requis) | ✅ | ✅ |
| Soumettre une demande de devis | ✅ | ✅ |
| Voir ses propres demandes | ✅ | ✅ |
| Laisser un avis | ✅ | ✅ |
| Voir toutes les demandes (tous clients) | ❌ | ✅ |
| Modifier le statut d'une demande | ❌ | ✅ |
| Créer / Modifier / Supprimer des services | ❌ | ✅ |
| Lire les messages de contact | ❌ | ✅ |
| Gérer les comptes clients | ❌ | ✅ |
| Supprimer des avis | ❌ | ✅ |

### Flux d'Authentification Email

```
Inscription → sendEmailVerification() → Email envoyé
     → L'utilisateur clique le lien dans sa boîte mail
     → Reconnexion → emailVerified === true
     → useAuth crée le doc Firestore (role: "CLIENT")
     → Redirection vers /dashboard
```

> **Google Auth** : Les comptes Google sont pré-vérifiés par Google, le document Firestore est créé immédiatement à la première connexion.

---

## 📦 Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-compte/ejarnauld-soft.git
cd ejarnauld-soft

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement (voir section ci-dessous)
cp .env.example .env.local
# Éditez .env.local avec vos vraies clés Firebase

# 4. Lancer le serveur de développement
npm run dev
```

> L'app sera disponible sur `http://localhost:3000`

---

## 🔑 Configuration Firebase (.env)

Créez un fichier `.env.local` à la racine en vous basant sur `.env.example`.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_projet
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_projet.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

> ⚠️ **Ne jamais commiter `.env.local`** — il est dans `.gitignore` par défaut.
> Le fichier `.env.example` (sans vraies valeurs) peut lui être commité.

**Obtenir les clés Firebase :**
1. Allez sur [console.firebase.google.com](https://console.firebase.google.com)
2. Sélectionnez votre projet → Paramètres → Configuration de l'application

---

## 📁 Structure du Projet

```
src/
├── app/                       # Routes Next.js (App Router)
│   ├── layout.tsx             # Layout global + SEO metadata
│   ├── page.tsx               # Page d'accueil publique
│   ├── account/               # Auth (Login / Register / Forgot)
│   ├── dashboard/             # Espace client (route protégée)
│   ├── admin/                 # Espace admin (route protégée)
│   ├── booking/               # Formulaire de demande de devis
│   ├── services/              # Catalogue de services
│   ├── contact/               # Formulaire de contact
│   └── about/                 # Page À propos
│
├── components/
│   ├── layout/                # Navbar, Footer, PageTransition
│   └── ui/                    # Composants réutilisables
│       ├── Testimonials.tsx   # Carrousel témoignages (mobile-first)
│       ├── CustomCursor.tsx   # Curseur personnalisé (desktop only)
│       ├── Motion.tsx         # Wrappers d'animation (FadeUp, etc.)
│       └── ...
│
├── lib/
│   └── firebase/
│       ├── config.ts          # Initialisation Firebase (env vars only)
│       ├── auth.ts            # Fonctions d'authentification + email verification
│       └── db.ts              # CRUD Firestore (services, bookings, messages, reviews)
│
├── hooks/
│   └── useAuth.ts             # Hook global Auth + RBAC + email verification check
│
└── context/
    └── LanguageContext.tsx    # Contexte i18n (FR/EN)

public/
├── robots.txt                 # Directives robots SEO
└── sitemap.xml                # Sitemap pour les moteurs de recherche

firestore.rules                # Règles de sécurité Firestore (RBAC)
.env.example                   # Template de configuration (à dupliquer en .env.local)
```

---

## 🛡️ Règles Firestore (Sécurité)

Les règles RBAC complètes se trouvent dans [`firestore.rules`](./firestore.rules).

**⚠️ Important** : Ces règles doivent être copiées et appliquées manuellement dans la **Firebase Console** :
> Firebase Console → Firestore Database → Onglet **Règles** → Collez le contenu → Publiez.

Résumé des règles :
- **`/users`** : lecture/écriture de son propre doc uniquement. Les admins peuvent tout lire.
- **`/services`** : lecture publique, écriture admin uniquement.
- **`/bookings`** : un client ne voit que ses propres demandes. Seul l'admin peut changer les statuts.
- **`/messages`** : création publique (formulaire de contact), lecture/gestion admin uniquement.
- **`/reviews`** : lecture publique, création par utilisateurs vérifiés, suppression admin.

---

## 🚀 Déploiement Vercel

### Première fois

1. Pushez le code sur GitHub
2. Allez sur [vercel.com](https://vercel.com) → **New Project** → importez le repo
3. Dans **Environment Variables**, ajoutez toutes les variables de `.env.example` avec vos vraies valeurs
4. Cliquez **Deploy** ✅

### Mises à jour

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
# Vercel déploie automatiquement via CI/CD
```

---

## 📈 SEO & Performances

| Optimisation | Statut |
|---|:---:|
| OpenGraph (Facebook, LinkedIn) | ✅ |
| Twitter Card | ✅ |
| robots.txt | ✅ |
| sitemap.xml | ✅ |
| `backdrop-blur` optimisé (60 FPS) | ✅ |
| Curseur custom désactivé sur mobile | ✅ |
| Scroll throttlé (requestAnimationFrame) | ✅ |
| Images Next.js optimisées | ✅ |
| Routes admin/dashboard hors indexation | ✅ |

---

## 📄 Licence

Propriété exclusive de **E-Jarnauld Soft** — Tous droits réservés © 2026.
