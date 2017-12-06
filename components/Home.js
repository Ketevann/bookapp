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
import { getBookList, loadDefaultBookList, appendSaveBookList, startNewSaveBookList} from '../redux/actions/bookActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { Actions} from 'react-native-router-flux';

class Home extends Component {
  state = { loggedIn: null, messages:[], newBook:'' }

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






// componentDidMount(){
//   firebase.auth().onAuthStateChanged((user) => {
//          if (user) {
//            firebase.database().ref("users"+'/'+user.uid+'/').orderByChild('books').on("child_added", (snapshot)=>{
//             console.log (snapshot.val(), "------------->>>LL>>>>", snapshot.key)
//           })
          
//           var temp=[56,this.state.newBook]
//           var books={ books:temp}
//           firebase.database().ref("users"+'/'+user.uid+'/').set(books);
    
//          }
//          else null;
//         })
// }


/* Saving books*/ 
appendList(newBook){
  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          firebase.database().ref(`users/${user.uid}/books`).once('value', snapshot => 
              snapshot.val() ? this.props.appendSaveBookList(newBook, user.uid) : this.props.startNewSaveBookList(newBook, user.uid));
              //checking if theres a brach or not
          } else null;
      })
}

   

  render() {
    const { defaultBookList} = this.props.book,
          { saveBook } = this.props,
          { loggedIn } = this.props.auth;
          { console.log(this.props.auth,"defaultBookList=======================================>")}

    return (
      <View style={styles.container}>
          {/*<Button onPress= {() => this.appendList(34) }> check </Button>*/}
          <Button onPress= {() => Actions.preferencesForm() }> Preferences </Button>
          { defaultBookList ? defaultBookList.map((book, index)=><Book key={index}  book={book} saveBook={this.appendList.bind(this)}/>) : <Text>Loading Defaults</Text>}
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
    { loadDefaultBookList, loginDispatch, loginDispatchFalse, 
      appendSaveBookList,
      startNewSaveBookList
   })(Home)

