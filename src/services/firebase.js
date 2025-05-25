import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Firebase konfigürasyonu
const firebaseConfig = {
  apiKey: "AIzaSyCLuE8PiSBQaDQkoYfSr7HVZiUELjOOwo0",
  authDomain: "movieapprn-d9ab6.firebaseapp.com",
  projectId: "movieapprn-d9ab6",
  storageBucket: "movieapprn-d9ab6.appspot.com",
  messagingSenderId: "492621426073",
  appId: "1:492621426073:web:506190ab33049cd3cbb708",
};

// Firebase başlat
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Kullanıcı kaydı
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "users", uid), {
    email: email,
    likedMovies: [],
  });

  return userCredential.user;
};

// ✅ Kullanıcı girişi
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// ✅ Oturum kapatma
export const logoutUser = async () => {
  await signOut(auth);
};

// ✅ Hesabı kalıcı olarak sil
export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (!user) return;

  await deleteDoc(doc(db, "users", user.uid)); // Firestore'dan sil
  await deleteUser(user); // Auth'dan sil
};

// ✅ Beğenilen filmleri al
export const getLikedMovies = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().likedMovies : [];
};

// ✅ Film beğen
export const addLikedMovie = async (uid, movie) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const prev = docSnap.data().likedMovies || [];
    const alreadyExists = prev.some((m) => m.id === movie.id);
    if (alreadyExists) return;

    await updateDoc(docRef, {
      likedMovies: [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          genre_ids: movie.genre_ids || [],
        },
      ],
    });
  }
};

// ✅ Film beğenisini kaldır
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
