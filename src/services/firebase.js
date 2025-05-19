import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLuE8PiSBQaDQkoYfSr7HVZiUELjOOwo0",
  authDomain: "movieapprn-d9ab6.firebaseapp.com",
  projectId: "movieapprn-d9ab6",
  storageBucket: "movieapprn-d9ab6.firebasestorage.app",
  messagingSenderId: "492621426073",
  appId: "1:492621426073:web:506190ab33049cd3cbb708",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
