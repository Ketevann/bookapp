import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import {createLogger} from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import { apiMiddleware } from './redux/middleware';




export default store = createStore(
     rootReducer, {}, applyMiddleware(apiMiddleware, ReduxThunk, createLogger({collapsed: true})));


