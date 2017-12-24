import React, { Component } from 'react';
import { View, Text , Picker, ScrollView} from 'react-native';
import { Header, Card, CardSection, Button, Input } from './common';
import { updateQuery, searchFriend, saveFriend, deleteFriend, upDateDisplay} from '../redux/actions/friendActions';
import { connect } from 'react-redux';
import   firebase from 'firebase';
import {getSavedBooks} from '../redux/actions/bookActions';
import SavedBooks from './SavedBooks'

class Profile extends Component {

   state= {friendId : null}

 componentWillMount(){
   const {email} = this.props.friends
   console.log( ' dearchin books')

     firebase.database().ref(`users`).orderByChild('email').equalTo(email).once('value', (snapshot)=>{
        var foundUser = snapshot.val();
        console.log(foundUser)
        var userID = Object.keys(foundUser)[0];
        var books = foundUser[userID]['books']
        this.setState({friendId: userID})
        //this.props.getSavedBooks(userID)
        })
        // return <SavedBooks user={this.state.friendId} />


        // console.log(userID, 'books', Object.keys(foundUser), books)




 }
 displayBooks(){
 const {email} = this.props.friends
   console.log( ' dearchin books', this.state.friendId)

    //  firebase.database().ref(`users`).orderByChild('email').equalTo(email).once('value', (snapshot)=>{
    //     var foundUser = snapshot.val();
    //     console.log(foundUser)
    //     var userID = Object.keys(foundUser)[0];
    //     var books = foundUser[userID]['books']
    //     this.setState({friendId: userID})
    //     //this.props.getSavedBooks(userID)
    //     })
     if (this.state.friendId)
        {return <SavedBooks user={this.state.friendId} />


        console.log(userID, 'books', Object.keys(foundUser), books)}
        else return null

  }

  render() {
    {console.log(this.props,' jessica')}
    const { loggedIn } = this.props.auth;
    const { friendStatus } = this.props.friends;
    return (
       <ScrollView style={styles.container}>
         <Header headerText="Friends" />
          <Text>I am a friend</Text>
          {this.displayBooks()}
      </ScrollView>
    )
  }
}

styles = {
  container: {
    flex: 1,
    paddingHorizontal: 10
  }
}

export default connect(
    ({ auth, friends, book }) => ({auth: auth, friends: friends, book: book}),
    {
      getSavedBooks
    },
  )(Profile)
