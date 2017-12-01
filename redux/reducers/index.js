import {combineReducers} from 'redux';
import auth from './auth'
import defaultBookListReducer from './defaultBookListReducer';


export default combineReducers({
  auth: auth,
  defaultBookList: defaultBookListReducer
});
