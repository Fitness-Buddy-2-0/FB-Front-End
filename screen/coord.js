import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux'
import { allUsers } from '../store/users'
import store from '../store';
import styles from './styles';

class CoordDC extends Component {

  constructor(props) {
    super(props)
    const storeState = store.getState();
    this.state = {
      latitude: null,
      longitude: null,
      store: storeState
    };
    // console.log('props', this.props)
    this._isMounted = false;
    this.findCoordinates = this.findCoordinates.bind(this)
    this.updateLocation = this.updateLocation.bind(this)
  }
  componentDidMount() {
    this._isMounted = true;

  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        // console.log('position: ', position)

        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        // console.log('is the state updated? in find coordinates', this.state)
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    // console.log('I am at the end of find coordnates')
  };
  updateLocation = async () => {
    try {
      await this.findCoordinates()
      let coord = {
        location: {
          type: "Point",
          coordinates: [
            this.state.longitude,
            this.state.latitude
          ]
        }
      }
      // console.log('coord is', coord)

      // console.log('state', state)
      // console.log('props', this.props)
      // console.log('singleuser', this.props.singleUser)
      this.props.updateLocthunk()
    } catch (err) {
      console.log(err)
    }

  }
  render() {
    const users = this.props.users || []
    // console.log('mapstate users', this.props.users)
    if(!this.props.users){

    }
    return (
      <View style={page.container}>
        <TouchableOpacity style={page.refresh} onPress={this.updateLocation} >
          <View>
            <Text style={page.buttonTitle}>Refresh</Text>
          </View>
        </TouchableOpacity>
        {users.length < 1
          ? <Text>There are no users close to you</Text>
          :
          <Text style={page.pad}>
            {users.map(user => {
              return (
                <View key={user.uid} style={page.nearby}>
                  <Text style={page.person}>{user.userName}</Text>
                  {/* <Text style={page.person}>{user.gender}</Text>
                  <Text style={page.person}> coordinates: [{user.location.coordinates[0].toFixed(2)}, {user.location.coordinates[1].toFixed(2)}]
                  </Text> */}
                  <TouchableOpacity style={page.button} onPress={() => { this.props.navigation.navigate('Chat') }} >
                    <View>
                      <Text style={page.buttonTitle}>Chat</Text>
                    </View>
                  </TouchableOpacity>
                </View>

              )
            })
            }
          </Text>
        }
        <Button
          title="Back to home"
          onPress={() =>
            this.props.navigation.navigate('Welcome')
          }
        />
      </View>
    );
  }
}

const page = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  refresh: {
    marginLeft: 300,
    marginTop: 20,
    marginBottom: 50,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#48AFD9'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#48AFD9',
    marginTop: 20
  },
  nearby: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 20,
    borderBottomColor: 'teal',
    borderRadius: 15,
    backgroundColor: '#D2ECF6',
    alignItems: 'center',
    justifyContent: 'space-around'

  },
  person: {
    color: '#044783',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pad:{
    borderRadius:50,
    marginBottom: 100,
  }
});

const mapState = state => {
  return {
    // singleUser: state.singleUser.user,
    users: state.users
  }
}
const mapDispatch = dispatch => {
  return {
    updateLocthunk: () => dispatch(allUsers())
  }
}

export default connect(mapState, mapDispatch)(CoordDC)
