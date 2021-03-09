import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
// import user from './user'
import users from './users'
import messages from './message'
const reducer = combineReducers({
  // singleUser: user,
  users,
  messages
})

const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware)
)
const store = createStore(reducer, middleware)

export default store


