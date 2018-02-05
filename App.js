import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Router from './app/Router'
import firebase from 'firebase';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import store from './app/store/store';
import Home from './app/components/Home';
import { FIREBASE_CONFIG } from './keys';

export default class App extends React.Component {
  componentWillMount() {
    firebase.initializeApp( FIREBASE_CONFIG );
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
