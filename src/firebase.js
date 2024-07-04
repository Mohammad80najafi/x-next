// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'x-next-e8b7c.firebaseapp.com',
  projectId: 'x-next-e8b7c',
  storageBucket: 'x-next-e8b7c.appspot.com',
  messagingSenderId: '206791268766',
  appId: '1:206791268766:web:02ae080c082a68ffd2de8f',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
