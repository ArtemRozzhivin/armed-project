// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	signInWithPopup,
} from 'firebase/auth'


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

	apiKey: 'AIzaSyAIU5mwSmomcj8sOA3vF8cwPIuB_gYeHQ0',

	authDomain: 'maksim-car-armed.firebaseapp.com',

	projectId: 'maksim-car-armed',

	storageBucket: 'maksim-car-armed.appspot.com',

	messagingSenderId: '733477616419',

	appId: '1:733477616419:web:a0ec1bf81b78d5e1756a96'

}

export const signup = (email, password) =>
	createUserWithEmailAndPassword(auth, email, password)

export const login = (email, password) =>
	signInWithEmailAndPassword(auth, email, password)

export const logout = () => signOut(auth)

export const loginWithGoogle = () => {
	const googleProvide = new GoogleAuthProvider()
	return signInWithPopup(auth, googleProvide)
}



// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export { auth, db, firebaseApp }
