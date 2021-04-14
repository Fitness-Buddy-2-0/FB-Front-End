import React from 'react';
import { Dimensions, ScrollView, View, Text, TextInput, TouchableOpacity, keyboardVerticalOffset, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { db } from '../FirebaseSvc'
import styles from './styles';
import Firebase from '../FirebaseSvc'
import firebase from 'firebase'
import { gotMessages } from '../store/message'
const { height } = Dimensions.get("window");

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      uid: '',
      otherUser_uid: '',
      roomId: '',
      value: '',
      screenHeight: 0,
    }
    this.onSendPress = this.onSendPress.bind(this)
    this.createOrFindRoom = this.createOrFindRoom.bind(this)
    this.onContentSizeChange = this.onContentSizeChange.bind(this)
    // this.handleKeyDown = this.handleKeyDown.bind(this)
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  state = {
    messages: [],
  };
  createOrFindRoom(p1, p2) {
    //create or fetch room data from firestore
    let roomRef = db.collection("room").doc(p1 + p2)
    roomRef.get().then((doc) => {
      if (doc.exists) {
        this.setState({ roomId: doc.data().roomId })
      }
      else {
        const room = {
          roomId: p1 + p2,
          p1: p1,
          p2: p2
        }
        db.collection('room').doc(p1 + p2).set(room)
        this.setState({ roomId: p1 + p2 })
      }
    })
  }
  componentDidMount() {
    let user = Firebase.auth().currentUser;
    let userUid = user.uid
    let docRef = db.collection("users").doc(userUid)
    const { otherInChat } = this.props.route.params

    //if userUid < otherInChat, then userUid is p1, otherwise p2, for roomId(concat of p1 and p2)
    let p1, p2
    if (userUid < otherInChat) {
      p1 = userUid
      p2 = otherInChat
    }
    else {
      p1 = otherInChat
      p2 = userUid
    }
    this.createOrFindRoom(p1, p2)
    docRef.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          name: doc.data().userName
        })
      }
    })
    if (user !== null) {
      this.setState({
        email: user.email,
        uid: user.uid
      })
    }
    this.setState({
      otherUser_uid: otherInChat
    })
    this.props.gotMessages(p1 + p2)
  }

  componentWillUnmount() {
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };
  onSendPress() {
    if (this.state.value !== '') {
      db.collection('messages')
        .add({
          roomId: this.state.roomId,
          sender: this.state.uid,
          message: this.state.value,
          timestamp: firebase.firestore.Timestamp.fromMillis(Date.now())
        })
      this.setState({ value: '' })
    }
  }

  render() {
    const scrollEnabled = this.state.screenHeight > height;
    return (
      <KeyboardAvoidingView  style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={100}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollview}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={this.onContentSizeChange}
        onSubmitEditing={this.onSendPress}
      >
        <View>
          {this.props.messages.map((chat, index) => {
            return (
              <View key={index} style={chat.sender == this.state.uid ? styles.messagessender : styles.messagesreceiver}>
                <Text style={chat.sender == this.state.uid ? styles.messageS : styles.messageR}> {chat.message}</Text>
              </View>
            )
          })}
          <TextInput style={styles.input} onChangeText={(text) => this.setState({ value: text })} value={this.state.value} />

          {/* <TouchableOpacity style={styles.button} onPress={() => this.onSendPress()} >
            <View>
              <Text >Send</Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }

}

const mapState = state => {
  return {
    messages: state.message,
    users: state.users,
  }
}
const mapDispatch = dispatch => {
  return {
    updateLocthunk: (userId, coord) => dispatch(usersNearBy(userId, coord)),
    gotMessages: (id) => dispatch(gotMessages(id))
  }
}

export default connect(mapState, mapDispatch)(Chat)
