import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
import { saveBook, createBookShelf } from '../redux/actions/bookActions';
import { getPreferences, getDefualt } from '../redux/actions/preferencesActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { Actions} from 'react-native-router-flux';
import { connect } from 'react-redux';
import   firebase from 'firebase';
import   Book from './Book';
import   axios  from 'axios';
import   Search from './Search'

class Home extends Component {

  componentWillMount(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.props.loginDispatch(user.uid);
          this.props.getPreferences(user.uid);//if logged in, then check for saved preferences, loads either preferred books or defualt(if there are no preferences) to state
      }
        else {
          this.props.loginDispatchFalse()
          this.props.getDefualt() //if not logged in, then loads defualt books to state
        }
      })
  }

  onSaveBook(book){
            const userId = this.props.auth.userId;
            firebase.database().ref(`users/${userId}/books`).once('value', snapshot =>
                snapshot.val() ? this.props.saveBook(book, userId) : this.props.createBookShelf(book, userId)); //checking if a books db branch exists
  }

  render() {
    const { bookSuggestions } = this.props.book,
          { saveBook } = this.props,
          { loggedIn } = this.props.auth,
          { preferences, books } = this.props.preferences; //'books' is a bool, preferences are the actual books, 
          { console.log( this.props.preferences.books,"/preferences/" )}

    return (
      <View style={styles.container}>
      <Search />
        <Card>
          { books ? preferences.map((book, index)=><Book key={index}  book={book} onSaveBook={this.onSaveBook.bind(this)}/>) :  <Spinner size='large' />}
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
    ({ book, auth, preferences }) => ({ book: book, auth: auth, preferences: preferences  }),
    { loginDispatch, loginDispatchFalse,
      getPreferences,
      getDefualt,
      createBookShelf,
      saveBook
   })(Home)

