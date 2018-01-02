const INITIAL_STATE = { title: '', author: '', genre: '', loading: true , books:false,  preferences: [], hasSugguestions:false}
import {
 UPDATE_TITLE,
 UPDATE_AUTHOR,
 UPDATE_GENRE,
 CLEAR_BOOKS,
 UPDATE_SUGGESTIONS,
 HAS_SUGGESTIONS
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
    case UPDATE_SUGGESTIONS:
      //alert(action.payload)
      return {...preferences, preferences:action.payload}
      case HAS_SUGGESTIONS:
        return {...preferences, preferences:action.payload}

    default:
      return preferences
  }
}
