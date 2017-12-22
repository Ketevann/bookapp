const INITIAL_STATE = { email:''}
import {
  UPDATE_QUERY
} from '../actions/action-types'

export default ( friends = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_QUERY:
      return { ...friends, email: action.payload };
    default:
      return friends
  }
}
