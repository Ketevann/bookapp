import {combineReducers} from 'redux';
import auth from './auth'
import book from './book';
import cameraRoll from './cameraRoll'

import preferences from './preferences';

export default combineReducers({
  auth: auth,
  book:book,
  preferences: preferences,
  cameraRoll : cameraRoll
});
