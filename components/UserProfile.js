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

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import axios from 'axios';
import { width, height, totalSize } from 'react-native-dimension';
import SavedBooks from './SavedBooks'
class UserProfile extends Component {

componentDidMount() {


  console.log(this.props.userID,' ****')
      if (this.props.auth.userId) {



  this.props.getSavedBooks(this.props.auth.userId)
      }
      else return null



  }


// onDelete(title){
//   console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
//   this.props.removeBooks(this.props.auth.userId, title)
// }

// onRead(title){
//   console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
//   this.props.markAsRead(this.props.auth.userId, title)
// }

renderBooks(){

//      firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//       //  this.props.loginDispatch(user.uid)
//          const {userId} = this.props.auth
// console.log(user.uid, ' USER ID')

  //this.props.getSavedBooks(user.uid)
  if (this.props.book.savedBooks ){
  return (<SavedBooks renderBooks={this.props.book.savedBooks} user={this.props.auth.userId}/>)
      }
      else {
        return null
    }
   // })

}

  render() {


    { console.log(this.props, "preferences=======================================>") }


    return (
    <ScrollView>
    {this.renderBooks()}
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
  ({ book, auth, preferences,  }) => ({ book: book, auth: auth, preferences: preferences }),
  {

    getSavedBooks,
    removeBooks,
    markAsRead
  })(UserProfile)

