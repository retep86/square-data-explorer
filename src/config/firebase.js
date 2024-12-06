// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtxSo_zHby9FQKfv528HkPWDCNd8g3GCo",
  authDomain: "square-data-explorer-v1.firebaseapp.com",
  projectId: "square-data-explorer-v1",
  storageBucket: "square-data-explorer-v1.firebasestorage.app",
  messagingSenderId: "525068184628",
  appId: "1:525068184628:web:85b3370e9bdc38c7bb6e61",
  measurementId: "G-0091KHF5LP"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const emailProvider = new EmailAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export auth functions
export { 
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
};