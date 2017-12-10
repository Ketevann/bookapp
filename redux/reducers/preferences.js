const INITIAL_STATE = { title: '', author: '', genre: '', loading: true , preferences: null }
import {
 UPDATE_TITLE,
 UPDATE_AUTHOR,
 UPDATE_GENRE,
 FETCHED_SAVED_PREFERENCES,
} from '../actions/action-types'


export default (preferences = INITIAL_STATE, action) => {
  console.log(action, 'PREFERENCES ACTIONNN');
  switch (action.type) {
    case UPDATE_TITLE:
      //alert("UPDATE_TITLE");
      return { ...preferences, title: action.payload };
    case UPDATE_AUTHOR:
      //alert("UPDATE_AUTHOR");
      return { ...preferences, author: action.payload };
    case UPDATE_GENRE:
      //alert("UPDATE_GENRE");
      return { ...preferences, genre: action.payload };
    case FETCHED_SAVED_PREFERENCES:
      //alert(action.payload);
      return {...preferences, preferences: action.payload, loading:false}
    default:
      return preferences
  }
}
