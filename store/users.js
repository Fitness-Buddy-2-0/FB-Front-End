import { Alert } from 'react-native';
import axios from 'axios'
import { gotUser } from './user'
import {db} from '../FirebaseSvc'
const GOT_USERS = 'GOT_USERS'
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


export const allUsers = () =>async dispatch =>{
  try{
    let result = []
    const usersRef = db.collection('users')
    const snapshot = await usersRef.get()
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      result.push(doc.data())
    })
    dispatch(gotUsers(result))
  }catch(err) {
      console.log('Error getting documents', err);
  }

}



let initalState = []
export default function (state = initalState, action) {
  switch (action.type) {
    case GOT_USERS:
      console.log('==================================================')
      console.log('action users: ', action.users)
      return action.users;
    default:
      return state;
  }
}
