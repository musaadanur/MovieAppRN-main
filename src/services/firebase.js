import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

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

// Kullanıcı kaydet
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const uid = userCredential.user.uid;

  // Firestore'da kullanıcı belgesi oluştur
  await setDoc(doc(db, "users", uid), {
    email: email,
    likedMovies: [],
  });

  return userCredential.user;
};

// Kullanıcıyı giriş yaptır
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Oturumdan çıkış
export const logoutUser = async () => {
  await signOut(auth);
};

// Kullanıcının beğendiği filmleri al
export const getLikedMovies = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().likedMovies : [];
};

// Filme beğeni ekle
export const addLikedMovie = async (uid, movie) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const prev = docSnap.data().likedMovies || [];

    const alreadyExists = prev.some((m) => m.id === movie.id);
    if (alreadyExists) return;

    await updateDoc(docRef, {
      likedMovies: [...prev, movie],
    });
  }
};

// Film beğenisini kaldır
export const removeLikedMovie = async (uid, movieId) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const updated = docSnap.data().likedMovies.filter((m) => m.id !== movieId);
    await updateDoc(docRef, {
      likedMovies: updated,
    });
  }
};

export { auth, db };
