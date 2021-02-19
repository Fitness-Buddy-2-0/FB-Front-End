import React from 'react';
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
    this.getChat = this.getChat.bind(this)
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
    const { otherInChat } = this.props.route.params
    this.setState({
      otherUser_uid: otherInChat
    })
  }
  getChat() {
    // let docRef = db.collection("messages").where("sender", "==", this.state.uid)
    // console.log('docRef', docRef)
    // docRef.get()
    //   .then((doc) => {
    //     console.log('doc ', doc)
    //     doc.forEach((singledoc) => {
    //       this.setState({
    //         chats: [...this.state.chats, singledoc.data()]
    //       })
    //     })
    //   }).catch((error) => {
    //     console.log("Error getting documents: ", error);
    //   });
  }
  render() {


    this.getChat()
    console.log(this.state)
    return (
      <div>
        {this.state.chats.map((chat, index) => {
          return (
            <div key={index}>
              <p> receiver: {chat.receiver}</p>
              <p> message: {chat.message}</p>
              <p> sender: {chat.sender}</p>
            </div>
          )
        })}
      </div>
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
