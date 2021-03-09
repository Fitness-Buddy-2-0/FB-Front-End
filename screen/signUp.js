import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Firebase from '../FirebaseSvc'
import { connect } from 'react-redux';
import styles from './styles';
import {db} from '../FirebaseSvc'
// import auth from '@react-native-firebase/auth';


function SignUp(props) {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('female')
  const onFooterLinkPress = () => {
    props.navigation.navigate('LogIn');
  };

  const onRegisterPress = async () => {
    try{
      Keyboard.dismiss();
      const request = await Firebase.auth().createUserWithEmailAndPassword(email, password)
      if (request.user.uid) {
        const user = {
          uid: request.user.uid,
          email: email,
          userName: userName
        }
        db.collection('users')
          .doc(request.user.uid)
          .set(user)
      props.navigation.navigate('LogIn');
        }
    }catch(error){
      Alert.alert('Sorry, there was a problem creating an account. Please try again!');
    }
  }

  return (

    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='always'>
        <View>
          <TextInput
            style={styles.input}
            placeholder='Email'
            placeholderTextColor='#aaaaaa'
            onChangeText={text => setEmail(text)}
            value={email}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
          />
          <TextInput
            style={styles.input}
            placeholder='UserName'
            placeholderTextColor='#aaaaaa'
            onChangeText={text => setUserName(text)}
            value={userName}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
          />
          <TextInput
            style={styles.input}
            placeholderTextColor='#aaaaaa'
            secureTextEntry
            placeholder='Password'
            onChangeText={text => setPassword(text)}
            value={password}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
          />
          {/* <TextInput
            placeholderTextColor='#aaaaaa'
            secureTextEntry
            placeholder='Confirm Password'
            onChangeText={text => setConfirmPassword(text)}
            value={confirmPassword}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
          /> */}

          <TouchableOpacity style={styles.button} onPress={() => onRegisterPress()} >
            <View>
              <Text >SIGN UP</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                Log in
							</Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

// const mapState = state => ({
//   user: state.singleUser
// });

// const mapDispatch = dispatch => ({
//   gotUser: user => dispatch(registerNewUser(user))
// });

export default SignUp;
