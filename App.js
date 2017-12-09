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
      apiKey: "AIzaSyB-lzOIx1LfgG_epqj0tiCWb7ual2htX28",
    authDomain: "nativebookapp.firebaseapp.com",
    databaseURL: "https://nativebookapp.firebaseio.com",
    projectId: "nativebookapp",
    storageBucket: "nativebookapp.appspot.com",
    messagingSenderId: "912103368076"
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
