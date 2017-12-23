const INITIAL_STATE = { email:'', found:false, display:false, friendStatus:false}
import {
  UPDATE_QUERY,
  UPDATE_FRIEND_STATUS,
  UPDATE_SEARCH_RESULT,
  UPDATE_DISPLAY
} from '../actions/action-types'

export default ( friends = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_QUERY:
      return { ...friends, email: action.payload };//sets email input to state
    case UPDATE_FRIEND_STATUS:
      return { ...friends, friendStatus: action.payload };//setting whether friend exists or not in friends branch
    case UPDATE_SEARCH_RESULT:
      return { ...friends, found: action.payload };//setting if the email query has been registered in the bookApp db 
    case UPDATE_DISPLAY:
      return { ...friends, display: action.payload }//setting if component should display results or not 
    default:
      return friends
  }
}
