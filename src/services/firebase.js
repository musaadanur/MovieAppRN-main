import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
  getReactNativePersistence,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCLuE8PiSBQaDQkoYfSr7HVZiUELjOOwo0",
  authDomain: "movieapprn-d9ab6.firebaseapp.com",
  projectId: "movieapprn-d9ab6",
  storageBucket: "movieapprn-d9ab6.appspot.com",
  messagingSenderId: "492621426073",
  appId: "1:492621426073:web:506190ab33049cd3cbb708",
};


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await setDoc(doc(db, "users", userCredential.user.uid), {
    email,
    likedMovies: [],
  });
  return userCredential.user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, "users", user.uid));
  await deleteUser(user);
};

export const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};


export const getLikedMovies = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      email: auth.currentUser?.email,
      createdAt: new Date().toISOString(),
    });
  }

  const likedMoviesRef = collection(db, "users", uid, "liked_movies");
  const snapshot = await getDocs(likedMoviesRef);
  return snapshot.docs.map((doc) => doc.data());
};

export const addLikedMovie = async (uid, movie) => {
  const movieRef = doc(db, "users", uid, "liked_movies", movie.id.toString());
  await setDoc(movieRef, {
    ...movie,
    addedAt: new Date().toISOString(),
  });
};

export const removeLikedMovie = async (uid, movieId) => {
  const movieRef = doc(db, "users", uid, "liked_movies", movieId.toString());
  await deleteDoc(movieRef);
};

export { app, auth, db };
