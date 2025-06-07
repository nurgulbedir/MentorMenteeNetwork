import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
    apiKey: "AIzaSyCOs3C-CB1r6ntl9XHepxMgS33_D462fBE",
    authDomain: "mentor-mentee-newtwork.firebaseapp.com",
    projectId: "mentor-mentee-newtwork",
    storageBucket: "mentor-mentee-newtwork.appspot.com",
    messagingSenderId: "900162477505",
    appId: "1:900162477505:web:736c795ae68c3c57012340"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };
