import firebase from 'firebase';
import 'firebase/firestore'

const firebaseConfig = {
	  apiKey: "AIzaSyCkX68YCjKbSeScGkBVAKNXyEawvF0VIDU",
    authDomain: "fitness-buddy-20.firebaseapp.com",
    projectId: "fitness-buddy-20",
    storageBucket: "fitness-buddy-20.appspot.com",
    messagingSenderId: "819456950540",
    appId: "1:819456950540:web:22117c8b1016974bc68929",
    measurementId: "G-4NH76FN9XT"
}

// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()

// avoid deprecated warnings
db.settings({
	timestampsInSnapshots: true
})

export default Firebase
