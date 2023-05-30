import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDef-Ox2tKvklbwlKypuw8CLj0t1sNAc7g",
    authDomain: "react-todolist-a2dda.firebaseapp.com",
    projectId: "react-todolist-a2dda",
    storageBucket: "react-todolist-a2dda.appspot.com",
    messagingSenderId: "757815921982",
    appId: "1:757815921982:web:fac199c8603ebbbeb9f06f",
    measurementId: "G-954X45S0ZE"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
