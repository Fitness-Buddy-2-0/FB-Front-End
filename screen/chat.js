import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0
import { connect } from 'react-redux'
import {firebaseSvc} from '../FirebaseSvc';
import {db} from '../FirebaseSvc';

db.collection('chat').add({
  name: 'mikyla',
  message: 'Hello world!'
})
.then(function (docRef) {
  console.log(`Document written with ID: ${docRef.id}`);
})
.catch(function (error) {
  console.error(`Error adding document: ${error}`);
});

class Chat extends React.Component{

  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });

  state = {
    messages: [],
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSvc.send}
        user={this.props.singleUser}
      />
    );
  }

  componentDidMount() {
    firebaseSvc.refOn(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    firebaseSvc.refOff();
  }
}

const mapState = state => {
  return {
    singleUser: state.singleUser.user,
    users: state.users
  }
}
const mapDispatch = dispatch => {
  return {
    updateLocthunk: (userId, coord) => dispatch(usersNearBy(userId, coord))
  }
}

export default connect(mapState, mapDispatch)(Chat)
