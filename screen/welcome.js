import { Alert, View, Text, Button, StyleSheet, input,TouchableOpacity,Image } from 'react-native';
import React from 'react';
import { connect } from 'react-redux'
// import { removeUser } from '../store/user'
import firebaseSvc from '../FirebaseSvc';
import styles from './styles';

function WelcomePage(props) {
  const createLogoutAlert = () => {
    Alert.alert('Are you sure you want to log out?', null, [
      {
        text: 'OK',
        onPress: () => {
          //  await props.logOutUser()
          return firebaseSvc
            .auth()
            .signOut()
            .then(() => {
              console.log('You are signed out');
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
      <Text style={page.headline}>Welcome to your fitness budy finder!</Text>
      <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('NearBy')} >
          <View>
            <Text style = {styles.buttonTitle} >Find People Nearby</Text>
          </View>
        </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => createLogoutAlert()} >
          <View>
            <Text style = {styles.buttonTitle} >Log Out </Text>
          </View>
        </TouchableOpacity>
        <Image style={page.image}
          source={{uri: 'https://i1.wp.com/fitonapp.com/wp-content/uploads/shutterstock_679609810-1.jpg?resize=1024%2C683&ssl=1'}} />
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
  container:{
    flex: 1,
		alignItems: 'center',
    backgroundColor: '#D8E7F5'
  },
  image: {
    width: 350,
    height: 300,
    marginTop:20
  },
})

export default WelcomePage
