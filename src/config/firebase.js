import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtxSo_zHby9FQKfv528HkPWDCNd8g3GCo",
  authDomain: "square-data-explorer-v1.firebaseapp.com",
  projectId: "square-data-explorer-v1",
  storageBucket: "square-data-explorer-v1.firebasestorage.app",
  messagingSenderId: "525068184628",
  appId: "1:525068184628:web:85b3370e9bdc38c7bb6e61",
  measurementId: "G-0091KHF5LP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);