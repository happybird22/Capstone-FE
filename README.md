# 🌐 D&D Session Journal App (Frontend)

This is the React application for the **D&D Session Journal**, where users can log in, manage party notes, and filter their session logs. Built for adventurers who love to stay organized.

This app is fully client-side — there is no backend server. It talks directly to **Firebase Authentication** and **Cloud Firestore**, with authorization enforced by Firestore Security Rules (`firestore.rules`).

## ⚙️ Technologies Used

- **React** (Vite)
- **React Router DOM** – Routing
- **Firebase** – Authentication (email/password) + Firestore (data)
- **CSS Modules** – Component styling
- **Date-fns** – Date formatting

## 🔥 Features

- Register/login with protected routes
- Role-based UI: GM-exclusive views
- Create/edit/delete session notes
- Notes searchable by NPC, place, campaign, or free text
- Share notes privately, party-wide, or with specific party members
- Party invite codes for easy access
- Real-time shared Party Bank inventory, synced live across your party

## 🔧 Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com) (the free Spark plan is enough).
2. In **Authentication → Sign-in method**, enable the **Email/Password** provider.
3. In **Firestore Database**, create a database (Native mode).
4. In **Project settings → General → Your apps**, add a Web app and copy its config values.
5. Copy `.env.example` to `.env` and fill in the 7 `VITE_FIREBASE_*` values from step 4.
6. `npm install`
7. Deploy the security rules and indexes: `npx firebase-tools login`, then set your project ID in `.firebaserc`, then `npx firebase-tools deploy --only firestore`.
8. `npm run dev`

## Stretch Goals
- Add additional dynamic User Parties section to display parties and invite codes
- Add helpful hints for both DMs and Player Characters
- ~~Add shared inventory for all parties~~ ✅ Party Bank