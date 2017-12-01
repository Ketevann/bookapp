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
import { getBookListDataRedux, loadDefaultBookListData} from '../redux/actions/actions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'

class Home extends Component {
  state = { loggedIn: null }

  componentWillMount(){
      console.log('mounted');
      
      if (defaultList){
        console.log(defaultList, "default");
        this.props.loadDefaultBookListData(defaultList.Similar.Results);
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
    const { defaultBookList} = this.props.defaultBookList,
          { navigate } = this.props.navigation,
          { loggedIn , userUID } = this.props.auth;
          {console.log(this.props.auth,"defaultBookList=======================================>")}

    return (
      <View style={styles.container}>
          { defaultBookList ? defaultBookList.map((book, index)=><Book key={index}  book={book}/>) : <Text>Loading Defaults</Text>}
          { loggedIn ? <Button onPress={() =>firebase.auth().signOut()}>Sign Out</Button> : <Button onPress= {() => navigate('login') }> Sign in </Button>}
        <Text style={styles.header}>
          {/*{userUID ? <Text>{userUID} </Text>:null} to be used for saving books*/}
        </Text>
          { loggedIn ? <Button onPress={() =>firebase.auth().signOut()}>Log Out</Button>: <Button onPress= {() => navigate('login') }> Sign in </Button>}
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
    ({ defaultBookList, auth }) => ({ defaultBookList: defaultBookList, auth: auth }), 
    { loadDefaultBookListData, loginDispatch, loginDispatchFalse })(Home)

