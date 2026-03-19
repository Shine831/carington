# E-Jarnauld Soft - Solutions Informatiques 🚀

Bienvenue sur le dépôt officiel du projet **E-Jarnauld Soft**, une plateforme web premium dédiée aux services informatiques, à l'infogérance, et aux solutions Cloud & Réseaux pour les entreprises (B2B) et particuliers (B2C) au Cameroun et à l'international.

L'application offre une expérience utilisateur fluide, un design immersif (Glassmorphism, animations fluides), et intègre un espace client et un tableau de bord administrateur sécurisés.

---

## ✨ Fonctionnalités Principales

- **Dashboard Administrateur Intégré :** Gestion complète du CRUD pour les Devis (réservation), Services, Clients et Messages via une interface moderne et temps-réel.
- **Espace Client Sécurisé :** Permet aux utilisateurs de suivre l'évolution de leurs requêtes et devis en cours d'exécution de façon transparente en lien avec l'Administrateur.
- **Réservation et Formulaires Intelligents :** Soumission de demandes de devis et support technique reliée en flux continu à une base de données cloud.
- **Support Multilingue (i18n) :** Navigation et interfaces dynamiquement traduites en Français et Anglais.
- **Design Elite 2026 :** Interface propulsée par Tailwind CSS et Framer Motion offrant un branding professionnel (Shine Noir), des dégradés complexes (Aura), et une architecture 100 % Responsive (Mobile, Tablette, Desktop).

---

## 🛠️ Stack Technique

- **Framework Front-End :** [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Langage :** TypeScript
- **Style & Interface :** Tailwind CSS, Framer Motion (Animations), Lucide React (Icônes)
- **Back-End & Base de données :** Firebase (Auth & Firestore)
- **Déploiement Cible :** Vercel

---

## 🚀 Installation & Lancement Local

### Prérequis
- Node.js (version 18+ recommandée)
- npm ou yarn
- Un projet Firebase pré-configuré (Auth, Firestore)

### 1. Cloner le projet
\`\`\`bash
git clone https://github.com/votre-nom/ejarnauld-soft.git
cd ejarnauld-soft
\`\`\`

### 2. Variables d'environnement
Créez un fichier `.env.local` à la racine du projet et insérez vos identifiants Firebase :
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY="VOTRE_CLÉ"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="ejarnauld-soft.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="ejarnauld-soft"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."
\`\`\`

### 3. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

### 4. Lancer le serveur de développement
\`\`\`bash
npm run dev
\`\`\`
L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## 🔒 Sécurité et Firestore Rules

Ce projet intègre des règles de sécurité strictes pour Firestore garantissant que :
- Les profils utilisateurs ne sont accessibles ou modifiables que par leurs propriétaires respectifs et l'Administrateur.
- Les réservations et requêtes sont chiffrées (AES-256 E2E) et cloisonnées par utilisateur.
- Les modifications de statut ou l'ajout de composants catalogue sont restreints par le Rôle `ADMIN`.

**Configuration du Compte Administrateur:**
Le compte administrateur racine (ex: \`admin@gmail.com\`) bénéficie de permissions globales une fois flaggé dans la collection \`users\` correspondante.

---

## 🌐 Déploiement

Le guide de déploiement privilégié pour cette architecture est via **Vercel**. 
Il suffit de connecter le dépôt GitHub sur la console Vercel, et d'insérer les variables d'environnement (`NEXT_PUBLIC_FIREBASE_*`) dans les paramètres du projet avant le déploiement.

---

### Copyright
© 2026 E-Jarnauld Soft. Tous droits réservés.
