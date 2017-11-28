import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import {LoginForm} from './common/LoginForm'

class App extends Component {
  state = { loggedIn: null }
  componentWillMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyBxQ6Lpnp0FT8Fvg8g8Ic7_w4PDJwnqmMo',
      authDomain: 'auth-a98f1.firebaseapp.com',
      databaseURL: 'https://auth-a98f1.firebaseio.com',
      projectId: 'auth-a98f1',
      storageBucket: 'auth-a98f1.appspot.com',
      messagingSenderId: '314366021514'
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
      }
      else this.setState({ loggedIn: false })
    })
  }

renderContent(){
    switch(this.state.loggedIn){
      case true:
       return (
         <Button onPress={() => firebase.auth().signOut()}
       >Log Out</Button>)
      case false: return  <LoginForm />
      default:
      return <Spinner size="small" />
    }


}
  render() {
    return (
      <View>
        <Header headerText="Authentication" />
       {this.renderContent()}
      </View>
    );
  }
}

export default App;
