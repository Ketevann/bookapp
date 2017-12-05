import {combineReducers} from 'redux';
import auth from './auth'
import preferences from './preferences';

export default combineReducers({
  auth: auth,
  preferences: preferences
});
