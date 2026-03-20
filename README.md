<div align="center">

# Carington — E-Jarnauld Soft

**Plateforme de gestion IT haut de gamme pour le marché camerounais**

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

La plateforme propose :
- Un **site vitrine** bilingue (FR/EN) orienté conversion
- Un **dashboard client** sécurisé par PIN chiffré pour suivre ses demandes et soumettre des témoignages
- Un **panneau d'administration** complet pour gérer en temps réel les demandes, messages, clients, catalogue et avis

Toute l'expérience est conçue **mobile-first**, avec une esthétique premium, des animations Framer Motion et une architecture serverless entièrement hébergée sur Vercel + Firebase.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Langage | TypeScript 5 |
| Styles | Tailwind CSS v4 + CSS Variables |
| Animations | Framer Motion 12 |
| Backend / Auth | Firebase 12 (Firestore + Authentication) |
| Icônes | Lucide React |
| Déploiement | Vercel (Edge Network) |
| i18n | Système maison FR/EN + script Google Translate auto |

---

## Fonctionnalités clés

### 🌐 Site public
- Page d'accueil avec Hero animé, statistiques, services et témoignages clients dynamiques (Firestore)
- Pages À propos, Services, Contact avec formulaire persisté
- Blog / Politique de confidentialité
- Système de réservation (audit & devis) avec validation Zod

### 🔐 Sécurité & Authentification
- Authentification Firebase (email/mot de passe)
- PIN chiffré SHA-256 pour l'accès aux dashboards (4 chiffres client, 6 chiffres admin)
- Limitation de changement de PIN (max 1 fois / 24h)
- Re-authentification Firebase avant toute modification de mot de passe
- Vérification par email avant changement d'adresse (`verifyBeforeUpdateEmail`)

### 👤 Dashboard Client
- Suivi en temps réel des demandes de service
- Soumission et modification des témoignages avec notation 5 étoiles
- Modification du profil et du code PIN
- Session persistée via `sessionStorage`

### 🛡️ Dashboard Administrateur
- Vue synthétique : statistiques KPI en temps réel
- Gestion des demandes avec changement de statut + note admin
- Messagerie : lecture et archivage des messages de contact
- Gestion des clients et suppression de comptes
- Catalogue de services : créer, modifier, supprimer
- Modération des témoignages : lecture et suppression
- Badge de notification non-lus avec marquage persistant en base
- Changement sécurisé du mot de passe admin et du PIN maître

### 🌍 Internationalisation automatique
- Traduction FR → EN entièrement automatisée via Google Translate
- Cache intelligent des traductions (pas de re-traduction des chaînes non modifiées)
- Script intégré dans le pipeline de build (`prebuild`)

---

## Structure du projet

```
carington/
├── src/
│   ├── app/                          # Pages (App Router Next.js)
│   │   ├── page.tsx                  # Accueil
│   │   ├── about/                    # À propos
│   │   ├── services/                 # Services
│   │   ├── booking/                  # Formulaire devis
│   │   ├── contact/                  # Contact
│   │   ├── account/                  # Connexion / Inscription
│   │   ├── dashboard/                # Espace client
│   │   ├── admin/                    # Panneau administrateur
│   │   ├── privacy/                  # Politique de confidentialité
│   │   └── terms/                    # Conditions générales
│   ├── components/
│   │   └── ui/                       # Composants réutilisables
│   │       ├── AuraGradient.tsx
│   │       ├── Motion.tsx            # Animations Framer Motion
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Testimonials.tsx
│   ├── context/
│   │   ├── LanguageContext.tsx       # Contexte de langue global
│   │   └── translations.ts           # Dictionnaires FR/EN (auto-généré)
│   ├── hooks/
│   │   └── useAuth.ts                # Hook d'authentification Firebase
│   └── lib/
│       └── firebase/
│           ├── config.ts             # Initialisation Firebase
│           ├── auth.ts               # Fonctions d'authentification
│           └── db.ts                 # Fonctions Firestore (CRUD)
├── scripts/
│   └── auto-translate.mjs            # Script de traduction automatique FR→EN
└── public/                           # Assets statiques
```

---

## Installation locale

### Prérequis

- Node.js ≥ 18
- Un projet Firebase avec **Authentication** (email/password) et **Firestore** activés

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-username/carington.git
cd carington
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=admin@votredomaine.com
```

### 4. Configurer l'admin dans Firestore

Dans la collection `users`, le document correspondant à l'administrateur doit contenir :

```json
{
  "role": "ADMIN",
  "pin": "<SHA-256 hash du PIN à 6 chiffres>"
}
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

→ Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (hot reload) |
| `npm run build` | Build de production (déclenche l'auto-traduction) |
| `npm run start` | Démarre le build de production |
| `npm run lint` | Analyse ESLint |
| `npm run translate` | Lance manuellement l'auto-traduction FR→EN |

> **Note :** La traduction FR→EN s'exécute **automatiquement** à chaque `npm run build` via le hook `prebuild`. Les chaînes déjà traduites sont mises en cache dans `scripts/.translate-cache.json` pour éviter toute requête inutile.

---

## Déploiement sur Vercel

### Option A — Interface Vercel (recommandé)

1. Pousser le code sur GitHub
2. Sur [vercel.com](https://vercel.com), importer votre dépôt
3. Ajouter les variables d'environnement Firebase dans les paramètres du projet
4. Cliquer sur **Deploy** — Vercel détecte automatiquement Next.js

> La traduction FR→EN s'exécutera automatiquement lors du build Vercel via le hook `prebuild`.

### Option B — CLI Vercel

```bash
npm install -g vercel
vercel --prod
```

---

## Règles de sécurité Firestore recommandées

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Utilisateurs : lecture/écriture sur son propre document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Bookings : propriétaire ou admin
    match /bookings/{id} {
      allow read, write: if request.auth != null;
    }

    // Messages de contact : écriture publique, lecture admin seulement
    match /messages/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Services : lecture publique, écriture admin
    match /services/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Reviews : lecture publique, écriture authentifiée, suppression admin
    match /reviews/{id} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

---

## Roadmap

- [ ] Notifications push (Firebase Cloud Messaging)
- [ ] Tableau de bord analytique (graphiques de tendances)
- [ ] Export des données (CSV / PDF)
- [ ] Mode maintenance admin
- [ ] Support multilingue étendu (Espagnol, Arabe)

---

## Contribution

Les contributions sont les bienvenues. Pour contribuer :

1. Forker le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Committer vos changements (`git commit -m 'feat: ma feature'`)
4. Pousser la branche (`git push origin feature/ma-feature`)
5. Ouvrir une **Pull Request**

---

## Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

Développé avec ❤️ par **E-Jarnauld Soft** — Douala, Cameroun 🇨🇲

</div>
