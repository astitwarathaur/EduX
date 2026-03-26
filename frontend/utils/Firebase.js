import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginedux-46504.firebaseapp.com",
  projectId: "loginedux-46504",
  storageBucket: "loginedux-46504.firebasestorage.app",
  messagingSenderId: "791964317670",
  appId: "1:791964317670:web:d138ba6dbfefccf34f0827"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
