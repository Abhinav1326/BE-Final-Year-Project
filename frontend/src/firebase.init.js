import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBu-J_6E2U_o0bpgcs5yDlSX9wMco1sbjI",
  authDomain: "jobportalautomation.firebaseapp.com",
  projectId: "jobportalautomation",
  storageBucket: "jobportalautomation.firebasestorage.app",
  messagingSenderId: "1030871921659",
  appId: "1:1030871921659:web:d399a794dc81ff24a0915e",
  measurementId: "G-66M6LM7J8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;