import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebaseSDK from '../FirebaseSvc';
import { registerNewUser } from '../store/user';
import { connect } from 'react-redux';

function SignUp(props) {
	const [firstName, setFirstName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
	const onFooterLinkPress = () => {
		props.navigation.navigate('LogIn');
	};

	const onRegisterPress = () => {
		Keyboard.dismiss();
		if (password !== confirmPassword) {
			Alert.alert("Passwords don't match. Please try again!");
			return;
		}
		firebaseSDK
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(async () => {
				let token = await firebaseSDK.auth().currentUser.getIdToken();
				const body = {
					token,
					email,
					firstName
				};
				await props.gotUser(body);
				props.navigation.navigate('Welcome');
			})
			.catch(() => {
				Alert.alert('Sorry, there was a problem creating an account. Please try again!');
			});
	};

	return (
		<View >
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps='always'>
				<View>
					<TextInput

						placeholder='Email'
						placeholderTextColor='#aaaaaa'
						onChangeText={text => setEmail(text)}
						value={email}
						underlineColorAndroid='transparent'
						autoCapitalize='none'
					/>
					<TextInput

						placeholderTextColor='#aaaaaa'
						secureTextEntry
						placeholder='Password'
						onChangeText={text => setPassword(text)}
						value={password}
						underlineColorAndroid='transparent'
						autoCapitalize='none'
					/>
					<TextInput

						placeholderTextColor='#aaaaaa'
						secureTextEntry
						placeholder='Confirm Password'
						onChangeText={text => setConfirmPassword(text)}
						value={confirmPassword}
						underlineColorAndroid='transparent'
						autoCapitalize='none'
					/>
         <TouchableOpacity onPress={() => onRegisterPress()} >
			    <View>
				  <Text >SIGN UP</Text>
			    </View>
		     </TouchableOpacity>
					<View>
						<Text>
							Already have an account?{' '}
							<Text onPress={onFooterLinkPress} >
								Log in
							</Text>
						</Text>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</View>
	);
}

const mapState = state => ({
	user: state.singleUser
});

const mapDispatch = dispatch => ({
	gotUser: user => dispatch(registerNewUser(user))
});

export default connect(mapState, mapDispatch)(SignUp);
