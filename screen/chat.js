import React from 'react';
import {View, Text} from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { connect } from 'react-redux'
import { firebaseSvc } from '../FirebaseSvc';
import { db } from '../FirebaseSvc'
import Firebase from '../FirebaseSvc'


class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      uid: '',
      otherUser_uid: '',
      chats: []
    }
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  state = {
    messages: [],
  };
  componentDidMount() {
    let user = Firebase.auth().currentUser;
    let userUid = user.uid
    let docRef = db.collection("users").doc(userUid)
    const { otherInChat } = this.props.route.params

//if userUid < otherInChat, then userUid is p1, otherwise p2, for roomId(concat of p1 and p2)
    let p1, p2
    if(userUid < otherInChat){
      p1 = userUid
      p2 = otherInChat
    }
    else{
      p1 = otherInChat
      p2 = userUid
    }
//create or fetch room data from firestore
    let roomRef = db.collection("room").doc(p1+p2)
    roomRef.get().then((doc)=>{
      console.log('doc: ',doc)
      if (doc.exists){
        console.log('exists!', doc.data())
      }
      else{
        console.log('here')
        const room = {
          roomId: p1+p2,
          p1: p1,
          p2: p2
        }
        db.collection('room').doc(p1+p2).set(room)
      }
    })


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

    let docRef2 = db.collection("messages").where("sender", "==", userUid)
    docRef2.get()
      .then((doc) => {
        doc.forEach((singledoc) => {
          this.setState({
            chats: [...this.state.chats, singledoc.data()]
          })
        })
      }).catch((error) => {
        console.log("Error getting documents: ", error);
      })
  }

  render() {
    console.log('chat state here: ',this.state)
    return (
      <View>
        {this.state.chats.map((chat, index) => {
          return (
            <View key={index}>
              <Text> receiver: {chat.receiver}</Text>
              <Text> message: {chat.message}</Text>
              <Text> sender: {chat.sender}</Text>
            </View>
          )
        })}
      </View>
    );
  }

  // componentDidMount() {
  //   firebaseSvc.refOn(message =>
  //     this.setState(previousState => ({
  //       messages: GiftedChat.append(previousState.messages, message),
  //     }))
  //   );
  // }
  // componentWillUnmount() {
  //   firebaseSvc.refOff();
  // }
}

const mapState = state => {
  return {
    // singleUser: state.singleUser.user,
    users: state.users
  }
}
const mapDispatch = dispatch => {
  return {
    updateLocthunk: (userId, coord) => dispatch(usersNearBy(userId, coord))
  }
}

export default connect(mapState, mapDispatch)(Chat)
