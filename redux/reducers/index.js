import {combineReducers} from 'redux';
import auth from './auth'
import reducers from './reducers';


export default combineReducers({
  auth: auth,
  reducers: reducers
});
