import React, { useState } from 'react';
import { Text, TextInput, View, Alert, Keyboard, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Firebase from '../FirebaseSvc';
// import { getUser } from '../store/user';
import { connect } from 'react-redux';
import styles from './styles';

function LoginScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFooterLinkPress = () => {
    props.navigation.navigate('SignUp');
  };

  const onLoginPress = () => {

    Keyboard.dismiss();
    Firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        // console.log('email', email)
        // await props.gotUser();
        props.navigation.navigate('Welcome')
      })

      .catch((error) => {
        Alert.alert('Your email or password is incorrect. Please try again!');
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='always'>
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
          placeholderTextColor='#aaaaaa'
          secureTextEntry
          placeholder='Password'
          onChangeText={text => setPassword(text)}
          value={password}
          // textContentType={'oneTimeCode'}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TouchableOpacity style={styles.button} onPress={() => onLoginPress()} >
          <View>
            <Text >LOG IN</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footerView} >
          <Text style={styles.footerText} >
            Don't have an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
						</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

// const mapState = state => ({
//   user: state.singleUser
// });

// const mapDispatch = dispatch => ({
//   gotUser: () => dispatch(getUser())
// });

export default LoginScreen;
