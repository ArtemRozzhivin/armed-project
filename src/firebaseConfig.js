// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

	apiKey: 'AIzaSyDZ6_Uq_eaUx9emEUz9cLoOjNNCYJDPe4s',

	authDomain: 'technical-assesment-1a151.firebaseapp.com',

	databaseURL: 'https://technical-assesment-1a151-default-rtdb.europe-west1.firebasedatabase.app',

	projectId: 'technical-assesment-1a151',

	storageBucket: 'technical-assesment-1a151.appspot.com',

	messagingSenderId: '575803030384',

	appId: '1:575803030384:web:70c8a3ae659bfb6bdbedb5'

}


// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export { auth, db, firebaseApp }