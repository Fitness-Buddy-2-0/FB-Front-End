import { Alert, View, Text, Button, StyleSheet, input, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { connect } from 'react-redux'
// import { removeUser } from '../store/user'
import Firebase from '../FirebaseSvc'
import firebase from 'firebase'
import styles from './styles';




function WelcomePage(props) {
  var uid = Firebase.auth().currentUser.uid;
  // Create a reference to this user's specific status node.
  // This is where we will store data about being online/offline.
  var userStatusDatabaseRef = Firebase.database().ref('/status/' + uid);
  // We'll create two constants which we will write to
  // the Realtime database when this device is offline
  // or online.
  var isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  // Create a reference to the special '.info/connected' path in
  // Realtime Database. This path returns `true` when connected
  // and `false` when disconnected.
  firebase.database().ref('.info/connected').on('value', function (snapshot) {
    // If we're not currently connected, don't do anything.
    if (snapshot.val() == false) {
      return;
    };

    // If we are currently connected, then use the 'onDisconnect()'
    // method to add a set which will only trigger once this
    // client has disconnected by closing the app,
    // losing internet, or any other means.
    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
      // The promise returned from .onDisconnect().set() will
      // resolve as soon as the server acknowledges the onDisconnect()
      // request, NOT once we've actually disconnected:
      // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

      // We can now safely set ourselves as 'online' knowing that the
      // server will mark us as offline once we lose connection.
      userStatusDatabaseRef.set(isOnlineForDatabase);
    });
  });


  var userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);

  // Firestore uses a different server timestamp value, so we'll
  // create two more constants for Firestore state.
  var isOfflineForFirestore = {
    state: 'offline',
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };

  var isOnlineForFirestore = {
    state: 'online',
    last_changed: firebase.firestore.FieldValue.serverTimestamp(),
  };

  firebase.database().ref('.info/connected').on('value', function (snapshot) {
    if (snapshot.val() == false) {
      // Instead of simply returning, we'll also set Firestore's state
      // to 'offline'. This ensures that our Firestore cache is aware
      // of the switch to 'offline.'
      userStatusFirestoreRef.set(isOfflineForFirestore);
      return;
    };

    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
      userStatusDatabaseRef.set(isOnlineForDatabase);

      // We'll also add Firestore set here for when we come online.
      userStatusFirestoreRef.set(isOnlineForFirestore);
    });
  });





  const createLogoutAlert = () => {
    Alert.alert('Are you sure you want to log out?', null, [
      {
        text: 'OK',
        onPress: () => {
          return Firebase
            .auth()
            .signOut()
            .then(() => {
              userStatusDatabaseRef.set(isOfflineForDatabase)
              userStatusFirestoreRef.set(isOfflineForFirestore)
              props.navigation.navigate("Home")
            });
        }
      },
      {
        text: 'Cancel',
        onPress: () => console.log('false alarm!')
      }
    ]);
  };
  return (
    <View style={page.container}>
      <Text style={page.headline}>Welcome to your fitness buddy finder!</Text>
      <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('NearBy')} >
        <View>
          <Text style={styles.buttonTitle} >Find People Nearby</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => createLogoutAlert()} >
        <View>
          <Text style={styles.buttonTitle} >Log Out </Text>
        </View>
      </TouchableOpacity>
      <Image style={page.image}
        source={{ uri: 'https://i1.wp.com/fitonapp.com/wp-content/uploads/shutterstock_679609810-1.jpg?resize=1024%2C683&ssl=1' }} />
    </View>
  );
}

// const mapState = state => {
//   return {
//     // singleUser: state.singleUser.user,
//     users: state.users
//   }
// }
// const mapDispatch = dispatch => {
//   return {

//   }
// }

// const mapDispatch = dispatch => {
//   return {
//     logOutUser: () => dispatch(removeUser())
//   }
// }

const page = StyleSheet.create({
  headline: {
    marginTop: 10,
    color: '#946DB0',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D8E7F5'
  },
  image: {
    width: 350,
    height: 300,
    marginTop: 20
  },
})

export default WelcomePage
