import { db } from '../FirebaseSvc'
const GET_MESSAGE = 'GET_MESSAGE'
const messagesInitial = []

const getMessage = (messages) => ({ type: GET_MESSAGE, messages })

// retrive message from firebase DB to store in redux store.
export const gotMessages = (id) => dispatch => {
  try {

    db.collection("messages").where("roomId", "==", id).orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
      let message = []
      snapshot.forEach((singledoc) => {
        message.push(singledoc.data())
      })
      getMessage(message)
    })
  } catch (err) {
    console.error('Error getting messages', err)
  }
}
export default function (state = messagesInitial, action) {
  switch (action.type) {
    case GET_MESSAGE:
      return action.messages
    default:
      return state
  }
}
