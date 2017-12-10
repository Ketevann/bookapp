const INITIAL_STATE = { title: '', author: '', genre: '', loading: true , preferences: [] }
import {
 UPDATE_TITLE,
 UPDATE_AUTHOR,
 UPDATE_GENRE,
 FETCHED_SAVED_PREFERENCES,
} from '../actions/action-types'


export default (preferences = INITIAL_STATE, action) => {
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
      return {...preferences, preferences: [...preferences.preferences , ...action.payload]}
    default:
      return preferences
  }
}
