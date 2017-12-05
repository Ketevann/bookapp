import {combineReducers} from 'redux';
import auth from './auth'
import defaultBookListReducer from './defaultBookListReducer';
import preferences from './preferences';

export default combineReducers({
  auth: auth,
  defaultBookList: defaultBookListReducer,
  preferences: preferences
});
