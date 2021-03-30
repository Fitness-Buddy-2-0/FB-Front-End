import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './homePage'
import Coord from './coord'
import LogIn from './logIn'
import SignUp from './signUp'
import Chat from './chat'
import WelcomePage from './welcome'
const Stack = createStackNavigator();

export default function Home() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="NearBy"
          component={Coord}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
        />

        <Stack.Screen
          name="Chat"
          component={Chat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

