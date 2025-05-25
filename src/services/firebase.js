import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  onAuthStateChanged,
  setPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Set persistence to use AsyncStorage
setPersistence(auth, getReactNativePersistence(AsyncStorage)).catch((error) => {
  console.error("Error setting persistence:", error);
});

// ✅ Kullanıcı kaydı
export const registerUser = async (email, password) => {
  try {
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
  } catch (error) {
    console.error("Register Error:", error);
    throw new Error(
      error.code === "auth/email-already-in-use"
        ? "Bu email adresi zaten kullanımda"
        : "Kayıt işlemi sırasında bir hata oluştu"
    );
  }
};

// ✅ Kullanıcı girişi
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error(
      error.code === "auth/invalid-credential"
        ? "Geçersiz email veya şifre"
        : "Giriş işlemi sırasında bir hata oluştu"
    );
  }
};

// ✅ Oturum kapatma
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw new Error("Çıkış işlemi sırasında bir hata oluştu");
  }
};

// ✅ Hesabı kalıcı olarak sil
export const deleteUserAccount = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await deleteDoc(doc(db, "users", user.uid)); // Firestore'dan sil
    await deleteUser(user); // Auth'dan sil
  } catch (error) {
    console.error("Delete Account Error:", error);
    throw new Error("Hesap silinirken bir hata oluştu");
  }
};

// ✅ Beğenilen filmleri al
export const getLikedMovies = async (uid) => {
  try {
    console.log("Fetching liked movies for user:", uid);

    // Önce users koleksiyonunda kullanıcı dokümanını kontrol et
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("User document does not exist, creating...");
      // Kullanıcı dokümanını oluştur
      await setDoc(userDocRef, {
        email: auth.currentUser?.email,
        createdAt: new Date().toISOString(),
      });
    }

    // Beğenilen filmleri al
    const likedMoviesRef = collection(db, "users", uid, "liked_movies");
    const snapshot = await getDocs(likedMoviesRef);
    const movies = snapshot.docs.map((doc) => doc.data());
    console.log("Fetched liked movies:", movies);
    return movies;
  } catch (error) {
    console.error("Get Liked Movies Error:", error);
    throw new Error(
      `Beğenilen filmler yüklenirken bir hata oluştu: ${error.message}`
    );
  }
};

// ✅ Film beğen
export const addLikedMovie = async (uid, movie) => {
  try {
    console.log("Adding movie to favorites:", movie);

    // Önce users koleksiyonunda kullanıcı dokümanını kontrol et
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("User document does not exist, creating...");
      // Kullanıcı dokümanını oluştur
      await setDoc(userDocRef, {
        email: auth.currentUser?.email,
        createdAt: new Date().toISOString(),
      });
    }

    // Filmi beğenilenlere ekle
    const movieRef = doc(db, "users", uid, "liked_movies", movie.id.toString());
    await setDoc(movieRef, {
      ...movie,
      addedAt: new Date().toISOString(),
    });
    console.log("Movie added successfully");
  } catch (error) {
    console.error("Add Liked Movie Error:", error);
    throw new Error(`Film beğenilirken bir hata oluştu: ${error.message}`);
  }
};

// ✅ Film beğenisini kaldır
export const removeLikedMovie = async (uid, movieId) => {
  try {
    console.log("Removing movie from favorites:", movieId);
    const movieRef = doc(db, "users", uid, "liked_movies", movieId.toString());
    await deleteDoc(movieRef);
    console.log("Movie removed successfully");
  } catch (error) {
    console.error("Remove Liked Movie Error:", error);
    throw new Error(
      `Film beğenisi kaldırılırken bir hata oluştu: ${error.message}`
    );
  }
};

// Auth state listener
export const setupAuthListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
