import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './components/Login'
import Router from './Router'

import firebase from 'firebase';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from './redux/middleware';
import ReduxThunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import store from './store'

import Home from './components/Home';

export default class App extends React.Component {
   componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAQLrnXMUPqPkfS6IiYI2pqJ-ix0L5ifwI',
      authDomain: 'test23-8732c.firebaseapp.com',
      databaseURL: 'https://test23-8732c.firebaseio.com',
      projectId: 'test23-8732c',
      storageBucket: 'test23-8732c.appspot.com',
      messagingSenderId: '196992616531'
    });
   }
  render(){
    return(
       <Provider store={store}>
          <Router />
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
