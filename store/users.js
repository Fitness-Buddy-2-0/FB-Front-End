import { db } from '../FirebaseSvc'
import Firebase from '../FirebaseSvc'
import firebase from 'firebase'
const geofire = require('geofire-common');
const GOT_USERS = 'GOT_USERS'
const radiusInM = 2000;
export const remove = () => ({ type: REMOVE_USERS })

export const gotUsers = users => ({ type: GOT_USERS, users })

export const storeGeoHash = (coord) => async dispatch => {
  try {
    // store user geohash
    const hash = geofire.geohashForLocation([coord.lat, coord.lng]);
    let user = Firebase.auth().currentUser;
    let userUid = user.uid
    // store user lat lng in db
    const londonRef = db.collection('users').doc(userUid);
    londonRef.update({
      geohash: hash,
      lat: coord.lat,
      lng: coord.lng
    })
  } catch (err) {
    console.log('store geohash err', err)
  }
}
export const nearbyUsers = (coord) => async dispatch => {
  try {
    console.log('calling nearbyUser')
    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    let result = []
    const center = [coord.lat, coord.lng]
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const idxToDistance = {}
    const promises = [];
    for (const b of bounds) {
      const q = db.collection('users')
        .orderBy('geohash')
        .startAt(b[0])
        .endAt(b[1]);

      promises.push(q.get());
    }
    // Collect all the query results together into a single list
    Promise.all(promises).then((snapshots) => {
      const matchingDocs = [];

      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get('lat');
          const lng = doc.get('lng');
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push(doc.data());
            matchingDocs[matchingDocs.length - 1].distance = Math.round(distanceInM)
          }
        }
      }
      return matchingDocs;
    }).then((matchingDocs) => {

      firebase.database().ref("status").on("value", snapshot => {
        const realtimeData = snapshot.val()
        matchingDocs = matchingDocs.map(person => {
          person.state = realtimeData[person.uid].state
          person.last_changed = realtimeData[person.uid].last_changed
          return person
        }).filter((person) => !(person.state == 'offline' && (person.last_changed < Date.now() - 7 * 24 * 60 * 60 * 1000))).map((person) => {
          if ((Date.now() - person.last_changed) / 1000 / 60 / 60 < 1) {
            person.lastOnline = Math.round((Date.now() - person.last_changed) / 1000 / 60)
            person.unit = 'm'
          } else if ((Date.now() - person.last_changed) / 1000 / 60 / 60 / 24 < 1) {
            person.lastOnline = Math.round((Date.now() - person.last_changed) / 1000 / 60 / 60)
            person.unit = 'h'
          } else {
            person.lastOnline = Math.floor((Date.now() - person.last_changed) / 1000 / 60 / 60 / 24)
            person.unit = 'd'
          }
          return person
        })
        dispatch(gotUsers(matchingDocs))
      })
    })
  } catch (err) {
    console.log('Error getting documents', err);
  }

}



let initalState = []
export default function (state = initalState, action) {
  switch (action.type) {
    case GOT_USERS:
      return action.users;
    default:
      return state;
  }
}
