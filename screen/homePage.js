import * as React from 'react';
import { View, Text, Button, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import styles from './styles';

const image= {uri:"https://cdn4.vectorstock.com/i/1000x1000/61/28/fitness-background-vector-6516128.jpg"}

const page = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#8688BC"
  },
  button: {
    marginTop: 12,
    marginLeft: 150,
    padding: 12,
    borderRadius: 10,
    width: '25%',
    color: "#666",
    backgroundColor: "#8688BC",
    opacity: 1
  },
  image: {
    // flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: '100%',
    height: '100%',
    opacity: 0.8
  },
});


export default function HomeScreen({ navigation }) {
  return (
    <View >
      <ImageBackground source={image} style={page.image} >
      <Text style= {styles.headline}>Welcome to Fitness Buddy!</Text>

      <TouchableOpacity style={page.button} onPress={() => navigation.replace('LogIn')} >
          <View>
            <Text style = {styles.buttonTitle} >Log In</Text>
          </View>
        </TouchableOpacity>




      <TouchableOpacity style={page.button} onPress={() => navigation.replace('SignUp')} >
          <View>
            <Text  style = {styles.buttonTitle} >Sign Up</Text>
          </View>
        </TouchableOpacity>
        </ImageBackground>
    </View>
  );
}
