import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
import { getBookSuggestions, saveBook, createBookShelf } from '../redux/actions/bookActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { Actions} from 'react-native-router-flux';
import { connect } from 'react-redux';
import   firebase from 'firebase';
import   defaultBooks  from './data/defaultBooks';
import   Book from './Book';
import   axios  from 'axios';
import Search from './Search'

class Home extends Component {

  componentWillMount(){
      if (defaultBooks){
        console.log(defaultBooks, "default");
        this.props.getBookSuggestions(defaultBooks.list);
      }else{
        console.log("defaultList not loaded");
      }

      firebase.auth().onAuthStateChanged((user) => {
        console.log((this.props, ' in authfirebase', user));
        if (user) {
          this.props.loginDispatch(user.uid)
        }
        else this.props.loginDispatchFalse()
      })
  }

  onSaveBook(book){
            const userId = this.props.auth.userId;
            firebase.database().ref(`users/${userId}/books`).once('value', snapshot =>
                snapshot.val() ? this.props.saveBook(book, userId) : this.props.createBookShelf(book, userId));
                //checking if a books db branch exists
  }


  render() {
    const { bookSuggestions } = this.props.book,
          { saveBook } = this.props,
          { loggedIn } = this.props.auth;
          { console.log( this.props.auth,"Auth=======================================>" )}

    return (

      <View style={styles.container}>
      <Search />
        <Card>
          { bookSuggestions ? bookSuggestions.map((book, index)=><Book key={index}  book={book} onSaveBook={this.onSaveBook.bind(this)}/>) :  <Spinner size='large' />}
          <CardSection>
            <Button onPress= {() => Actions.preferencesForm() }> Preferences </Button>
          </CardSection>
          <CardSection>
          { loggedIn ? <Button onPress={() =>firebase.auth().signOut()}>Log Out</Button>: <Button onPress= {() => Actions.login() }> Sign in </Button>}
          </CardSection>
        </Card>
       </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 12,
    height:20
  },
});

export default connect(
    ({ book, auth }) => ({ book: book, auth: auth }),
    { loginDispatch, loginDispatchFalse,
      getBookSuggestions,
      createBookShelf,
      saveBook
   })(Home)

