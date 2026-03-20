<div align="center">

# E-Jarnauld Soft — Plateforme B2B & Cybersécurité

**Infrastructure web de pointe pour le marché IT, Infogérance et Cybersécurité au Cameroun.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

[**→ Accéder à la plateforme**](https://ejarnauld-soft.vercel.app)

</div>

---

## 🏢 À propos du projet

La plateforme **E-Jarnauld Soft** a été architecturée de zéro pour répondre aux exigences drastiques de notre cabinet IT. Plus qu'une simple vitrine, c'est un véritable **portail client et CRM B2B** conçu pour la conversion, la gestion de projet et l'assistance technique continue.

Développée en interne par notre équipe d’ingénierie, cette solution met l'accent sur trois piliers :
1. **La Sécurité Absolue (ISO 27001 compliant)** : Chiffrement côté serveur, règles Firestore strictes, protections anti-bruteforce et hachage SHA-256.
2. **La Performance Brute (Zéro-Jank)** : Optimisée pour les réseaux africains et mondiaux avec une architecture Server-Side Rendering (SSR) sur Vercel Edge.
3. **L'Expérience Utilisateur (UI/UX Premium)** : Identité visuelle "Rouge & Blanc" corporative, animations fluides (Framer Motion) et parcours client sans friction.

---

## 🛠 Architecture & Stack Technique

Notre stack a été sélectionnée pour sa résilience et son évolutivité à long terme :

- **Core & Routing** : Next.js 16 (App Router)
- **Typage Statique** : TypeScript 5 (Strict Mode)
- **Design System** : Tailwind CSS v4 + Variables CSS natives
- **Micro-Interactions** : Framer Motion 12
- **Backend as a Service** : Firebase 12 (Authentication, Firestore, Security Rules)
- **Notification Transactionnelle** : Resend (Next.js Server Actions)
- **PWA (Progressive Web App)** : Manifest natif pour installation desktop/mobile
- **Internationalisation (i18n)** : Script interne Node.js de traduction automatique (FR/EN)

---

## 🚀 Fonctionnalités Principales

### 🌟 Espace Public & Acquisition
- **Design Mobile-First** : Expérience fluide garantie sur smartphone, tablette et bureau.
- **Formulaires Hautes Performances** : Réservation de services (Audit, Cloud, VoIP) et contact avec validation en temps réel.
- **PWA Ready** : Le site peut être installé directement sur l'écran d'accueil comme une application native iOS/Android.

### 🔐 Architecture de Sécurité (Dashboards)
- **Double Facteur de Validation** : Firebase Auth (Email/Mot de passe) couplé à un PIN d'accès métier haché.
- **Sécurité Anti-Bruteforce** : Gel des comptes après 5 tentatives de PIN échouées (quarantaine de 15 minutes).
- **Session Auto-Timeout** : Déconnexion automatique de l'espace administrateur après 30 minutes d'inactivité.
- **Intégrité Référentielle** : Suppression en cascade stricte (lorsqu'un compte est fermé, 100% des données associées s'évaporent de nos serveurs, RGPD compliant).

### 👥 Espace Client (B2B)
- Suivi en temps réel de l'état des missions (En attente, Actif, Terminé).
- Soumission d'Avis & Témoignages (intégration instantanée après approbation).
- Mise à jour cohérente du profil (Toute modification est répercutée dynamiquement chez l'administrateur).

### ⚙️ CRM E-Jarnauld (Espace Administrateur)
- Vues en temps réel des "Leads" et des "Tickets".
- Modification dynamique du catalogue de services et validation des témoignages clients.
- Modération intégrale de la base de données.
- **Notifications Email (Resend)** : Chaque nouveau devis déclenche une Server Action sécurisée prévenant instantanément l'équipe IT.

---

## 🏗 Déploiement & Installation Locale

Le code source a été conteneurisé et structuré de manière rigoureuse. Voici la procédure d'initialisation pour tout ingénieur rejoignant le projet :

### Prérequis
- **Node.js** ≥ 18
- Projet **Firebase** configuré (Authentication & Firestore)
- Clé d'API **Resend** (pour les emails transactionnels)

### 1. Cloner le Dépôt

```bash
git clone https://github.com/votre-username/ejarnauld-soft.git
cd ejarnauld-soft
```

### 2. Dépendances

```bash
npm install
```

### 3. Variables d'Environnement
Créez un fichier `.env.local` à la racine pour lier le front-end au backend serverless :

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Emailing System (Resend API)
RESEND_API_KEY=re_123456789_xxxxxxxxxxx
ADMIN_EMAIL=admin@e-jarnauld.com
```

### 4. Élévation de Privilèges Administrateur
La première configuration admin se fait dans Firestore. Dans la collection `users`, le document correspondant à l'e-mail administrateur doit impérativement spécifier :
```json
{
  "role": "ADMIN",
  "pin": "<Hash SHA-256 du code PIN à 6 chiffres>"
}
```

### 5. Lancement Local
```bash
npm run dev
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000).

---

## 📦 Pipeline & Scripts

Notre pipeline CI/CD intègre un moteur de traduction exclusif :

- `npm run dev` : Environnement de développement chaud.
- `npm run build` : Construction optimisée Vercel (déclenche la vérification et l'hybridation SSR/SSG).
- `npm run lint` : Contrôle qualité ESLint/TypeScript.
- `npm run translate` : Exécute le module interne pour générer la version anglaise (répertoire JSON) depuis les chaînes françaises.

---

## 🛡 Régulation Firestore — Security Rules

Le déploiement des règles d'accès à la base de données est la dernière étape critique. Un fichier `firestore.rules` est inclus dans le répertoire racine.
Pour déployer la stratégie de sécurité sur le cloud :
```bash
npx firebase deploy --only firestore:rules
```

---

<div align="center">
  Conçu, développé et maintenu par <strong>l'Équipe d'Ingénierie E-Jarnauld Soft</strong>.<br>
  <em>L'Excellence Numérique au service de votre croissance.</em>
</div>
