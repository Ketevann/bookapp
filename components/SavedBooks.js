import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,

} from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
import { getSavedBooks,removeBooks } from '../redux/actions/bookActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import axios from 'axios';
import { width, height, totalSize } from 'react-native-dimension';

class SavedBooks extends Component {

componentWillMount() {



     firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.loginDispatch(user.uid)
         const {userId} = this.props.auth
console.log(user.uid, ' USER ID')

  this.props.getSavedBooks(user.uid)
      }
      else this.props.loginDispatchFalse()
    })


  }


onDelete(title){
  console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
  this.props.removeBooks(this.props.auth.userId, title)
}



  render() {


    { console.log(this.props,  this.props.book, this.props.book.savedBooks, "preferences=======================================>") }


    return (
      <ScrollView>


      {this.props.book.savedBooks
?
        this.props.book.savedBooks.map(title =>{


         return (<View><Text>{title}</Text><Button onPress={() => this.onDelete(title)}>Delete</Button></View>)
    })

  :  null}


      </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  }


});

export default connect(
  ({ book, auth, preferences }) => ({ book: book, auth: auth, preferences: preferences }),
  {
    loginDispatch,
    loginDispatchFalse,
    getSavedBooks,
    removeBooks
  })(SavedBooks)

