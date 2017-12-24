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
import SavedBooks from './SavedBooks'
class UserProfile extends Component {

// componentWillMount() {



//      firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         this.props.loginDispatch(user.uid)
//          const {userId} = this.props.auth
// console.log(user.uid, ' USER ID')

//   this.props.getSavedBooks(user.uid)
//       }
//       else this.props.loginDispatchFalse()
//     })


//   }


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
  if (this.props.auth.userId !== ''){
  return (<SavedBooks user={this.props.auth.userId}/>)
      }
      else {this.props.loginDispatchFalse()
        return null
    }
   // })

}

  render() {


    { console.log(this.props,  this.props.book.savedBooks, "preferences=======================================>") }


    return (
      <ScrollView>


    <Text>some</Text>
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
  ({ book, auth, preferences, friends }) => ({ book: book, auth: auth, preferences: preferences, friends: friends }),
  {
    loginDispatch,
    loginDispatchFalse,
    getSavedBooks,
    removeBooks,
    markAsRead
  })(UserProfile)

