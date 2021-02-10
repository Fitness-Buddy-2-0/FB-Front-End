import firebase from 'firebase';
class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) { //avoid re-initializing
      firebase.initializeApp({
        apiKey: "AIzaSyCkX68YCjKbSeScGkBVAKNXyEawvF0VIDU",
        authDomain: "fitness-buddy-20.firebaseapp.com",
        projectId: "fitness-buddy-20",
        storageBucket: "fitness-buddy-20.appspot.com",
        messagingSenderId: "819456950540",
        appId: "1:819456950540:web:22117c8b1016974bc68929",
        measurementId: "G-4NH76FN9XT"
      });
     }
  }
  // login = async (user, success_callback, failed_callback) => {
  //   await firebase
  //     .auth()
  //     .signInWithEmailAndPassword(user.email, user.password)
  //     .then(success_callback, failed_callback);
  // };
  auth = () => firebase.auth();
  signInWithEmailAndPassword =(email, password)=> firebase.signInWithEmailAndPassword(email, password)
  signOut = () => firebase.signOut();
  get ref() {
    return firebase.database().ref('Messages');
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  refOn = callback => {
    this.ref
      .limitToLast(20)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.ref.push(message);
    }
  };

  refOff() {
    this.ref.off();
  }

}
export const firebaseSvc = new FirebaseSvc();
export var db = firebase.firestore()
