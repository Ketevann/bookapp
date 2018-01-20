const INITIAL_STATE = { preferenceType: null, keyWord:'', title: '', author: '', genre: '', loading: true , books:false,  preferences: null, hasSugguestions:false}
import {
 UPDATE_PREFERENCE_TYPE,
 UPDATE_PREFERENCE_KEYWORD,
 UPDATE_SUGGESTIONS,
 LOADING
} from '../actions/action-types'


export default (preferences = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PREFERENCE_KEYWORD:
      return { ...preferences, keyWord: action.payload };
    case UPDATE_PREFERENCE_TYPE:
      return { ...preferences, preferenceType: action.payload };
    case UPDATE_SUGGESTIONS:
      return {...preferences, preferences:action.payload };
    case LOADING:
      return {...preferences, loading: action.payload };
    default:
      return preferences
  }
}
