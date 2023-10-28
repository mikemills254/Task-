import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA0nyz713a0eTyCG6GAeP2iKdtb9N5sGQ4",
    authDomain: "news-app-11e24.firebaseapp.com",
    projectId: "news-app-11e24",
    storageBucket: "news-app-11e24.appspot.com",
    messagingSenderId: "46189132744",
    appId: "1:46189132744:web:7c1b8fced7b76c5cdb1efd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const Db = getFirestore(app)