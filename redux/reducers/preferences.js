const INITIAL_STATE = { preferenceType: null, keyWord:'', loading: true , books:false,  preferences: null, hasSugguestions:false, valueErr:false, typeErr: false}
import {
 UPDATE_PREFERENCE_TYPE,
 UPDATE_PREFERENCE_KEYWORD,
 UPDATE_SUGGESTIONS,
 UPDATE_TYPE_ERROR,
 UPDATE_VALUE_ERROR,
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
    case UPDATE_TYPE_ERROR:
      return {...preferences, typeErr:action.payload };
    case  UPDATE_VALUE_ERROR:
      return {...preferences, valueErr:action.payload };
    case LOADING:
      return {...preferences, loading: action.payload };
    default:
      return preferences
  }
}
