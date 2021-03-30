import * as firebase from 'firebase';
import 'firebase/functions'


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

firebase.functions().database.ref('/status/{uid}').onUpdate(
    async (change, context) => {
      // Get the data written to Realtime Database
      console.log('in syncStatus function')

      const eventStatus = change.after.val();

      // Then use other event data to create a reference to the
      // corresponding Firestore document.
      const userStatusFirestoreRef = db.doc(`status/${context.params.uid}`);

      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      const statusSnapshot = await change.after.ref.once('value');
      const status = statusSnapshot.val();
      functions.logger.log(status, eventStatus);
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }

      // Otherwise, we convert the last_changed field to a Date
      eventStatus.last_changed = new Date(eventStatus.last_changed);

      // ... and write it to Firestore.
      return userStatusFirestoreRef.set(eventStatus);
    });

export default Firebase
