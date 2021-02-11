// import { Alert } from 'react-native';
// import axios from 'axios'
// import { useHistory } from "react-router-dom"
// import firebaseSvc from '../FirebaseSvc'
// const GOT_USER = 'GOT_USER'
// const REMOVE_USER = "REMOVE-USER"
// const UPDATE_LOCATION = 'UPDATE_LOCATION'
// const ERROR_LOGIN = 'ERROR_LOGIN'
// const RESET_ERROR = 'RESET_ERROR'
// export const gotUser = user => ({ type: GOT_USER, user })

// export const remove = () => ({ type: REMOVE_USER })

// export const getLocation = user => ({ type: UPDATE_LOCATION, user })
// export const errorLogin = err => ({ type: ERROR_LOGIN, err })
// export const resetError = () => ({ type: RESET_ERROR })

// // export const getUser = () => async dispatch => {
// //   let res

// //   try {
// //     const token = await firebaseSvc.auth().currentUser.getIdToken();
// //     // console.log(token)
// //     // res = await axios.post('https://fitness-buddy-backend.herokuapp.com/auth/login', { token })
// //     // // console.log('printing res', res)
// //     // dispatch(gotUser(res.data))
// //   } catch (err) {
// //     console.log(err.response)
// //     dispatch(errorLogin(err.message))
// //   }
// // }
// //user: email, password, gender
// // export const registerNewUser = user => async dispatch => {
// //   try {
// //     const { data } = await axios.post('https://fitness-buddy-backend.herokuapp.com/auth/signup', user);
// //     dispatch(gotUser(data));
// //   } catch (err) {
// //     console.log(err.message, err.response);
// //   }
// // }
// // export const removeUser = () => async dispatch => {
// //   try {
// //     await axios.post('https://fitness-buddy-backend.herokuapp.com/auth/logout')
// //     dispatch(remove())
// //     history.push('/login')
// //   } catch (err) {
// //     next(err)
// //   }
// // }


// let initalState = {
//   user: {},
//   error: null
// }
// export default function (state = initalState, action) {
//   switch (action.type) {
//     case GOT_USER:
//       return { ...state, user: action.user, err: false };
//     case REMOVE_USER:
//       return initalState;
//     case ERROR_LOGIN:
//       return { ...state, error: true }
//     case RESET_ERROR:
//       return { ...state, error: null }
//     default:
//       return state;
//   }
// }
