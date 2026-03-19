# 🏛️ E-JARNALUD SOFT — Elite IT Architecture

> **Souveraineté Numérique & Résilience Infrastructurelle.**  
> Plateforme premium de gestion de services informatiques et cybersécurité pour le Cameroun et l'international.

![Licence](https://img.shields.io/badge/Status-Production--Ready-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Firebase%20%7C%20Framer-black?style=for-the-badge)
![UI](https://img.shields.io/badge/Design-Shine%20Noir%202026-C8102E?style=for-the-badge)

---

## 💎 Vision & Excellence
E-JARNALUD SOFT n'est pas qu'un simple prestataire IT. Nous architecturons des écosystèmes numériques robustes, alliant **performance brute** et **sécurité sans compromis**. Cette plateforme est la vitrine de notre savoir-faire technologique, offrant une interface immersive de haute précision.

### 🚀 Points Forts
*   **Catalogue Dynamique** : Gestion en temps réel des expertises (Cyber, Réseaux, VoIP, etc.) via Firestore.
*   **Audit d'Intervention** : Système de demande de devis et de suivi opérationnel chiffré.
*   **Dashboard Elite** : Interface d'administration "Full CRUD" pour une gestion agile du catalogue et des requêtes.
*   **Design 2026** : Esthétique "Shine Noir" avec Glassmorphism, animations cinématiques et réactivité totale (Mobile & Desktop).
*   **Authentification Multi-Canal** : Accès sécurisé via Email/Mot de passe et Google SSO.

---

## 🛠️ Stack Technologique
L'infrastructure repose sur les technologies les plus résilientes du marché :

*   **Core** : [Next.js](https://nextjs.org/) (App Router) — Vitesse et SEO optimisés.
*   **Database & Backend** : [Firebase Firestore](https://firebase.google.com/) — Multi-tenant, temps réel et serveurs haute disponibilité.
*   **Security** : Firebase Auth (RBAC : Admin/Client) & Firestore Security Rules.
*   **Styling** : Tailwind CSS 4.0 (Performance & Flexibilité).
*   **Motion** : Framer Motion (Interactions microscopiques & cinématiques).
*   **Icons** : Lucide React (Architecture visuelle claire).

---

## ⚙️ Déploiement & Configuration

### 1. Prérequis
Assurez-vous d'avoir un projet Firebase actif avec **Authentication** et **Cloud Firestore** activés.

### 2. Variables d'Environnement
Créez un fichier `.env.local` et renseignez les clés suivantes :

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="ejarnauld-soft.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="ejarnauld-soft"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="ejarnauld-soft.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

### 3. Lancement Local
```bash
npm install
npm run dev
```

### 4. Déploiement Vercel
Connectez simplement votre dépôt GitHub à [Vercel](https://vercel.com/). Les variables d'environnement doivent être ajoutées dans les paramètres du projet Vercel pour le déploiement en production.

---

## 🔒 Sécurité Firestore
Le projet utilise des règles de sécurité granulaires. L'accès aux données est restreint par rôle (`ADMIN` vs `CLIENT`). Assurez-vous de charger les règles définies pour garantir l'intégrité du système.

---

## 📄 Licence & Copyright
© 2026 **E-JARNALUD SOFT**. Tous droits réservés.  
Conception et développement orientés vers l'excellence infrastructurelle.
