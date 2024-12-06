import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
const auth = getAuth(app);

// Set up Google provider
const provider = new GoogleAuthProvider();

export { auth, provider };