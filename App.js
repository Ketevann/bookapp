import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './components/Login'


import {Provider} from 'react-redux';
import {createStore, applyMiddleware } from 'redux';
import reducers  from './redux/reducers/reducers';
import { apiMiddleware } from './redux/middleware';
import Home from './components/Home';

export default class App extends React.Component {
  render(){
    const store = createStore(reducers, {}, applyMiddleware(apiMiddleware));
    return(
       <Provider store={store}>
        <Home/>
         {/*<Login />*/}
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
