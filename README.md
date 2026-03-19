# Carington - Elite Solutions Agency

![Carington Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

Carington is a state-of-the-art digital platform designed for an Elite Solutions Agency. It provides a highly secure, performant, and premium experience for both clients and administrators to manage critical projects, technical services, and professional testimonials.

## ✨ Premium Features

### 🛡️ Advanced Security & Auth
- **Dual-Factor Security**: Industry-standard authentication coupled with a **Master PIN** system for sensitive operations.
- **Anti-Brute Force**: 24-hour cooldown delays on security modifications (PIN/Password).
- **Graceful Re-authentication**: Secure email and profile updates requiring session validation.
- **RBAC (Role-Based Access Control)**: Granular permissions separating Elite Clients from System Administrators.

### 👤 Client Experience
- **Personalized Dashboard**: Real-time project tracking with AES-256 encrypted session visualization.
- **Testimonial Autonomy**: Clients have full control over their public reviews, with dedicated CRUD capabilities.
- **Booking Intelligence**: Streamlined quote request system for tailored technical solutions.
- **Identity Management**: Seamless profile customization (Display Name, Email, Security Codes).

### ⚡ Technical Excellence
- **Edge Performance**: Built with Next.js 15 for optimal server-side rendering and lighting-fast interactions.
- **Aesthetic Excellence**: 2026 design language featuring Glassmorphism, Aura Gradients, and micro-animations via Framer Motion.
- **Mobile-First Core**: Fully responsive architecture ensuring a premium experience on any device, from smartphones to ultra-wide displays.
- **Firebase Infrastructure**: Robust backend powered by Firestore and Firebase Auth for real-time data synchronization.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS & Tailwind CSS (Utility-First)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/DB**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Deployment**: [Vercel](https://vercel.com/)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- Firebase Project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/carington.git
   cd carington
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the root directory and populate it with your Firebase credentials (refer to `.env.example`):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

### Production Build
To generate a production-ready bundle:
```bash
npm run build
```

## 📂 Project Structure

```text
src/
├── app/             # Next.js App Router (Pages & Layouts)
├── components/      # UI & Reusable Components
├── context/         # React Context (Language, Auth)
├── hooks/           # Custom React Hooks
├── lib/             # Firebase Configuration & DB Logic
└── public/          # Static Assets & Metadata
```

## 🌐 Deployment

This project is optimized for **Vercel**. Simply connect your GitHub repository to Vercel, import the environment variables, and it will deploy automatically on every push.

---
© 2026 Carington. All rights reserved. Built for Excellence.
