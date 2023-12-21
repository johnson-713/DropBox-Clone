import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyASxHHeIeNqYs8xtB6r6xFsYSsJPgehwK0",
    authDomain: "dropbox-clone-a6510.firebaseapp.com",
    projectId: "dropbox-clone-a6510",
    storageBucket: "dropbox-clone-a6510.appspot.com",
    messagingSenderId: "936058143192",
    appId: "1:936058143192:web:fe4d66d9568d5230deb2ad"
  };

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage }