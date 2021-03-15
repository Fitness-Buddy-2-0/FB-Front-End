import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { db } from '../FirebaseSvc'
import styles from './styles';
import Firebase from '../FirebaseSvc'
import firebase from 'firebase'
import { gotMessages } from '../store/message'

class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      uid: '',
      otherUser_uid: '',
      roomId: '',
      value: ''
    }
    this.onSendPress = this.onSendPress.bind(this)
    this.createOrFindRoom = this.createOrFindRoom.bind(this)
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
      console.log('doc: ', doc)
      if (doc.exists) {
        console.log('exists!', doc.data())
        this.setState({ roomId: doc.data().roomId })

      }
      else {
        console.log('here')
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

  onSendPress() {
    db.collection('messages')
      .add({
        roomId: this.state.roomId,
        sender: this.state.uid,
        message: this.state.value,
        timestamp: firebase.firestore.Timestamp.fromMillis(Date.now())
      })
    this.setState({ value: '' })
  }

  render() {
    console.log('chat state here: ', this.state)
    console.log('what are the messages, ', this.props)
    return (
      <View>
        {this.props.messages.map((chat, index) => {
          return (
            <View key={index} style={chat.sender == this.state.uid ? styles.messagessender : styles.messagesreceiver}>
              <Text style={chat.sender == this.state.uid ? styles.messageS : styles.messageR}> {chat.message}</Text>
            </View>
          )
        })}
        <TextInput style={styles.input} onChangeText={(text) => this.setState({ value: text })} value={this.state.value} />
        <TouchableOpacity style={styles.button} onPress={() => this.onSendPress()} >
          <View>
            <Text >Send</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}

const mapState = state => {
  return {
    messages: state.messages,
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
