import { db } from '../FirebaseSvc'
import Firebase from '../FirebaseSvc'
const geofire = require('geofire-common');
const GOT_USERS = 'GOT_USERS'
const radiusInM = 500;
export const remove = () => ({ type: REMOVE_USERS })

export const gotUsers = users => ({ type: GOT_USERS, users })

//coord: {location: {
//     type: "Point",
//     coordinates: [
//         logitude,
//         latitude,
//     ]
// }}

// export const usersNearBy = (id, coord) => async dispatch => {
//   try {
//     const res = await axios.put(`https://fitness-buddy-backend.herokuapp.com/api/users/${id}/location`, coord)
//     dispatch(gotUser(res.data))
//     const { data } = await axios.get(`https://fitness-buddy-backend.herokuapp.com/api/users/${id}/nearby`)
//     dispatch(gotUsers(data))
//   } catch (err) {
//     console.log(err.message)
//   }
// }
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
//      let coord = { lat: this.state.latitude, lng: this.state.longitude }
export const nearbyUsers = (coord) => async dispatch => {
  try {
    // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // a separate query for each pair. There can be up to 9 pairs of bounds
    // depending on overlap, but in most cases there are 4.
    let result = []
    const center = [coord.lat, coord.lng]
    const bounds = geofire.geohashQueryBounds(center, radiusInM);
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

          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) {
            matchingDocs.push(doc);
          }
        }
      }
      return matchingDocs;
    }).then((matchingDocs) => {
      matchingDocs.forEach((doc) => {
        console.log(doc.id, '=>', doc.data())
        result.push(doc.data())
        console.log('result', result)
      })
      console.log('about to dispatch result', result)
      dispatch(gotUsers(result))
    })

    // // getting all users
    // const usersRef = db.collection('users')
    // const snapshot = await usersRef.get()
    // snapshot.forEach(doc => {
    //   console.log(doc.id, '=>', doc.data());
    //   result.push(doc.data())
    // })
    // dispatch(gotUsers(result))

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
