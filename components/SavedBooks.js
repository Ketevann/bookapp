import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,

} from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
import { getSavedBooks,removeBooks,
markAsRead } from '../redux/actions/bookActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import axios from 'axios';
import { width, height, totalSize } from 'react-native-dimension';

class SavedBooks extends Component {

componentWillMount() {



  console.log(this.props.user, ' printing suer');
  this.props.getSavedBooks(this.props.user)




  }


onDelete(title){
  console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
  this.props.removeBooks(this.props.auth.userId, title)
}

onRead(title){
  console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
  this.props.markAsRead(this.props.auth.userId, title)
}



  render() {


    { console.log(this.props,  this.props.book.savedBooks, "preferences=======================================>") }


    return (
      <ScrollView>


      {this.props.book.savedBooks
?
        this.props.book.savedBooks.map(book =>{


         return (<View><Text>{book.title}</Text>
        {this.props.auth.userId === this.props.user ?
          <View>
         <Button onPress={() => this.onDelete(book.title)}>Delete</Button>
         <Button onPress={() => this.onRead(book.title)}>Read</Button>
         </View> : null}
         </View>)
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
  ({ book, auth, preferences, friends }) => ({ book: book, auth: auth, preferences: preferences, friends: friends }),
  {
    loginDispatch,
    loginDispatchFalse,
    getSavedBooks,
    removeBooks,
    markAsRead
  })(SavedBooks)

