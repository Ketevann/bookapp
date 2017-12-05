import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import firebase from 'firebase';
import axios  from 'axios';
import defaultList  from './data/defaultList';
import Book from './Book';
import { Button} from './common';
import { connect } from 'react-redux';
import { getBookList, loadDefaultBookList, saveBook} from '../redux/actions/bookActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { Actions} from 'react-native-router-flux';

class Home extends Component {
  state = { loggedIn: null }

  componentWillMount(){
      console.log('mounted');
      
      if (defaultList){
        console.log(defaultList, "default");
        this.props.loadDefaultBookList(defaultList.Similar.Results);
      }else{
        console.log("defaultList not loaded");
      }
      
      firebase.auth().onAuthStateChanged((user) => {
      console.log((this.props, ' in authfirebase', user))
      if (user) {
        this.props.loginDispatch(user.uid)
      }
      else this.props.loginDispatchFalse()
    })
}


  render() {
    const { defaultBookList} = this.props.book,
          { saveBook } = this.props,
          { loggedIn } = this.props.auth;
          {console.log(this.props.auth,"defaultBookList=======================================>")}

    return (
      <View style={styles.container}>
          <Button onPress= {() => Actions.preferencesForm() }> Preferences </Button>
          { defaultBookList ? defaultBookList.map((book, index)=><Book key={index}  book={book} saveBook={saveBook}/>) : <Text>Loading Defaults</Text>}
        <Text style={styles.header}>
        </Text>
          { loggedIn ? <Button onPress={() =>firebase.auth().signOut()}>Log Out</Button>: <Button onPress= {() => Actions.login() }> Sign in </Button>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginVertical: 20,
  },
});

export default connect(
    ({ book, auth }) => ({ book: book, auth: auth }), 
    { loadDefaultBookList, loginDispatch, loginDispatchFalse, saveBook })(Home)

