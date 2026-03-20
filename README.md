<div align="center">

# Carington — E-Jarnauld Soft

**Plateforme de gestion IT & Cybersécurité de pointe pour le marché camerounais**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[**→ Voir la démo en direct**](https://carington.vercel.app)

</div>

---

## À propos du projet

**Carington** est l'interface web officielle d'**E-Jarnauld Soft**, entreprise spécialisée en infrastructures IT, cybersécurité et infogérance basée à Douala, Cameroun.

La plateforme se distingue par :
- Un **site vitrine** bilingue (FR/EN) conçu pour la conversion.
- Un **dashboard client** hyper-sécurisé par PIN pour le suivi de projet et le recueil de témoignages.
- Un **panneau d'administration CRM** ultra-performant pour gérer en temps réel les requêtes, messages, KPI, catalogue et modération.

Ce projet incarne les tendances **UI/UX 2026** (Mobile-first, zérolag/jank, fluidité absolue via Framer Motion & Lenis) encapsulées dans une architecture performante SSR sur Vercel Edge Networks.

---

## 🛠 Stack Technique

- **Framework Core** : Next.js 16 (App Router)
- **Langage Moteur** : TypeScript 5
- **Design System** : Tailwind CSS v4 + Variables CSS (Thème Premium Rouge/Blanc)
- **Motion & Fluency** : Framer Motion 12 + Lenis Smooth Scroll
- **Backend as a Service** : Firebase 12 (Authentication, Firestore, Security Rules)
- **Internationalisation** : Module d'auto-traduction Node.js embarqué
- **Déploiement** : Vercel

---

## 🚀 Fonctionnalités Clés

### 🌟 Expérience Publique (Front-Office)
- **Zéro-Jank UI** : Accélération matérielle, translations fluides et micro-interactions avancées.
- **Thème Premium** : Identité visuelle percutante Rouge/Blanc inspirée des leaders de la tech mondiale.
- **Réservation Stratégique** : Tunnel de devis sécurisé avec validation (Zod).
- **Internationalisation Dynamique** : Traduction automatique maintenue en cache pour des performances optimales.

### 🔐 Architecture de Sécurité (Accès Dashboards)
- **Double Authentification Métier** : Combo Firebase Auth + Code PIN interne (chiffrement robuste SHA-256).
- **Contrôle Granulaire** : Limitation anti-bruteforce (1 modif PIN max / 24h).
- **Règles Firestore Strictes** : Isolation absolue des données clients (ISO 27001 compliant).

### 👥 Espace Client
- Suivi en temps réel des avancées de services (Statuts : Pending, Active, Completed).
- Soumission d'Avis & Expériences (Intégration instantanée).
- Profil et paramètres sécurisés.

### ⚙️ Espace Administration
- Métriques KPI en temps réel.
- Vue synoptique de toutes les demandes et des messages entrants.
- Mécanisme d'annotation interne pour collaborer sur le compte client.
- Modération intégrale des services et des reviews.

---

## 🏗 Installation Locale

### Prérequis
- **Node.js** ≥ 18
- Projet **Firebase** configuré (Authentication par Email/Mot de passe & base de données Firestore activée).

### 1. Cloner le Projet

```bash
git clone https://github.com/votre-username/carington.git
cd carington
```

### 2. Dépendances

```bash
npm install
```

### 3. Variables d'Environnement
Créez un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=admin@votredomaine.com
```

### 4. Élévation de Privilèges Administrateur
Dans Firestore, dans la collection `users`, le document correspondant à l'e-mail administrateur doit spécifier :
```json
{
  "role": "ADMIN",
  "pin": "<Hash SHA-256 de votre PIN à 6 chiffres>"
}
```

### 5. Démarrer l'environnement
```bash
npm run dev
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000).

---

## 📦 Scripts Disponibles

- `npm run dev` : Démarrage du serveur local.
- `npm run build` : Construction optimisée (inclut la traduction auto).
- `npm run lint` : Analyse de conformité du code ESLint.
- `npm run translate` : Exécute le module interne pour générer l'anglais depuis les chaînes françaises via l'API Google Translate.

---

## 🛡 Focus Sécurité — Firestore Rules
Un fichier `firestore.rules` est inclus dans le projet. Pour garantir l'intégrité des opérations (les clients ne lisent que leurs données, les reviews sont lisibles, tout le reste est côté admin), veillez à exécuter le déploiement exclusif :
```bash
npx firebase deploy --only firestore:rules
```

---

<div align="center">
  Développé et architecturé avec exigence par l'équipe <strong>E-Jarnauld Soft</strong>.
</div>
