--Project Information--
MemeHub a platform where laughter never ends..

# Memehub Frontend (TypeScript + Firebase)

A frontend-only meme sharing platform built using React (TypeScript) and Firebase. Users can upload and view memes. Firebase handles backend functionality like image storage and database.

---

## Table of Contents

- [Features](#-features)
- [Architecture & Flow](#-architecture--flow)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Project Structure](#-project-structure)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🚀 Features

- Upload memes (image + title)
- View all uploaded memes in a responsive grid
- Store image metadata in Firestore
- Store meme images in Firebase Storage

---

## 🔁 Architecture & Flow

### App Flow:

1. \*\*Home Page (/):

   - Loads and displays memes in descending order of timestamp.
   - Each meme has a title and image.

2. \*\*Upload Page (/upload):

   - Allows the user to input a meme title and upload an image.
   - Upon submission:

     - Image is uploaded to Firebase Storage.
     - The image URL, title, timestamp, and default likes are saved to Firestore.

### Firebase Flow:

- _Storage_:

  - Stores uploaded image files under the path memes/{uuid}

- _Firestore_:

  - Stores meme metadata as documents in the memes collection.
  - Each document includes:

    ts
    {
    title: string;
    imageUrl: string;
    timestamp: FirebaseFirestore.Timestamp;
    likes: number;
    }

---

## 🧰 Tech Stack

- _React (TypeScript)_ - for UI
- _Firebase Firestore_ - for storing meme metadata
- _Firebase Storage_ - for image hosting
- _React Router_ - for routing
- _Tailwind CSS_ - for styling

---

## 🛠 Setup Instructions

### 1. Clone the repository

bash
git clone https://github.com/yourusername/memehub-frontend.git
cd memehub-frontend

### 2. Install dependencies

bash
npm install

### 3. Firebase Setup

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable _Firestore Database_ and _Firebase Storage_
- Create a memes collection manually (or let the app create it on upload)
- Go to _Project Settings > General > Your Apps_ and get your Firebase config.
- Replace the placeholder values in src/firebase.ts with your config:

ts
const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_PROJECT_ID.appspot.com",
messagingSenderId: "YOUR_SENDER_ID",
appId: "YOUR_APP_ID"
};

### 4. Run the app

bash
npm run dev

# or if using CRA:

npm start

---

## 📁 Project Structure

src/
├── components/
│ ├── MemeList.tsx # Meme grid view
│ └── MemeUploadForm.tsx # Upload form
├── pages/
│ ├── Home.tsx # Homepage (meme feed)
│ └── Upload.tsx # Meme upload page
├── firebase.ts # Firebase config
└── App.tsx # Router setup

---

## 🧪 Future Improvements

- [ ] Add user authentication (Google/Firebase Auth)
- [ ] Add a like button with real-time like updates
- [ ] Comment system under each meme
- [ ] Search bar and meme filters (by tag or popularity)
- [ ] Pagination or infinite scroll

---

.

---

## ✨ Contribution

Feel free to fork and submit pull requests. Suggestions and improvements are welcome!
