const INITIAL_STATE = { title: '', author: '', genre: '', loading: false }
import {
 UPDATE_TITLE,
 UPDATE_AUTHOR,
 UPDATE_GENRE
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
    default:
      return preferences
  }
}
