import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD1ZouwYyAthmem1moAdH7L4onK_ZdMHIM",
  authDomain: "insta-fullstack.firebaseapp.com",
  projectId: "insta-fullstack",
  storageBucket: "insta-fullstack.appspot.com",
  messagingSenderId: "874225352421",
  appId: "1:874225352421:web:462c684292bb0b45895e0c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
