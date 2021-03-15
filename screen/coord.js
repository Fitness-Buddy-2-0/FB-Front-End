import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux'
import { nearbyUsers, storeGeoHash } from '../store/users'
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
    this._isMounted = false;
    this.findCoordinates = this.findCoordinates.bind(this)
    this.updateLocation = this.updateLocation.bind(this)
  }
  componentDidMount() {
    this.findCoordinates()
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  findCoordinates() {
    navigator.geolocation.getCurrentPosition(
      async position => {
        await this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  async updateLocation() {
    try {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
      let coord = { lat: this.state.latitude, lng: this.state.longitude }
      console.log('printing coordinates,', coord)
      this.props.storeGeoHash(coord)
      this.props.updateLocthunk(coord)
    } catch (err) {
      console.log(err)
    }

  }
  render() {
    const users = this.props.users || []
    // console.log('mapstate users', this.props.users)
    console.log('in coord, render, printing users', users)
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
                  <TouchableOpacity style={page.button} onPress={() => {
                    this.props.navigation.navigate('Chat', {
                      otherInChat: user.uid
                    })
                  }} >
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
  pad: {
    borderRadius: 50,
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
    storeGeoHash: (coord) => dispatch(storeGeoHash(coord)),
    updateLocthunk: (coord) => dispatch(nearbyUsers(coord))
  }
}

export default connect(mapState, mapDispatch)(CoordDC)
