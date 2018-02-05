import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import {createLogger} from 'redux-logger'
import ReduxThunk from 'redux-thunk'

export default store = createStore(
     rootReducer, {}, applyMiddleware( ReduxThunk, createLogger({collapsed: true})));


