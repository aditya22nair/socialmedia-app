
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { collection, query ,orderBy  } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAZa6XG6T7ToV1-ZQYiD-Sx3C0rnA_k8Sw",
  authDomain: "socialmedia-1d369.firebaseapp.com",
  projectId: "socialmedia-1d369",
  storageBucket: "socialmedia-1d369.appspot.com",
  messagingSenderId: "226188385825",
  appId: "1:226188385825:web:720979b236b043609e4d60",
  measurementId: "G-9F3DYDZ2J2"
});

const db = getFirestore(firebaseApp);
const q = query(collection(db, "user"),orderBy('timestamp','desc'));
const storage = getStorage(firebaseApp);



export {db , q , storage};