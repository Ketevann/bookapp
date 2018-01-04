import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
import { saveBook, createBookShelf } from '../redux/actions/bookActions';
import { getSuggestions, getDefualt, displaySuggestions } from '../redux/actions/preferencesActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import firebase from 'firebase';
import defaultBooks from './data/defaultBooks';
import Book from './Book';
import axios from 'axios';
import Search from './Search'
import Footer from './Footer'
class Home extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.loginDispatch(user.uid);
        this.props.getSuggestions(user.uid);//if logged in, then check for saved preferences, loads either preferred books or defualt(if there are no preferences) to state
      }
      else {
        this.props.loginDispatchFalse()
        this.props.getDefualt() //if not logged in, then loads defualt books to state
      }
    })
  }

  onSaveBook(book) {
    const userId = this.props.auth.userId;
    firebase.database().ref(`users/${userId}/books`).once('value', snapshot =>
      snapshot.val() ? this.props.saveBook(book, userId) : this.props.createBookShelf(book, userId));
    //checking if a books db branch exists

  }
  render() {
    const { saveBook } = this.props
    const { loggedIn } = this.props.auth
    const { preferences } = this.props.preferences;
    { console.log(this.props.preferences.preferences, this.props, "preferences=======================================>") }


    return (

      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <Search />

          {this.props.book && this.props.book.similarbooks ?
            this.props.book.similarbooks.map(allbooks =>

              (<ScrollView>
                <Text style={{ padding: 10 }}>{allbooks.title}</Text>
                <Text style={{ padding: 10 }}>{allbooks.description}</Text>
                {allbooks.imageLinks ?
                  <Image
                    style={{ width: 150, height: 200 }}
                    source={{ uri: `${allbooks.imageLinks.thumbnail}` }}
                  />
                  : <Image
                    style={{ width: 150, height: 200 }}
                    source={{ uri: `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1024px-No_image_3x4.svg.png` }}
                  />}
              </ScrollView>)

            ) :


            <Card>
              {preferences ? preferences.map((book, index) => <Book key={index} book={book} onSaveBook={this.onSaveBook.bind(this)} />) : <Spinner size='large' />}
              {loggedIn ? <CardSection>
                <Button onPress={() => Actions.preferencesForm()}> Preferences </Button>
              </CardSection> : null}
              <CardSection>
                {loggedIn ? <Button onPress={() => firebase.auth().signOut()}>Log Out</Button> : <Button onPress={() => Actions.login()}> Sign in </Button>}
              </CardSection>
            </Card>
          }
        </ScrollView>


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
    height: 20
  },
});

export default connect(

  ({ book, auth, preferences }) => ({ book: book, auth: auth, preferences: preferences }),
  {
    loginDispatch, loginDispatchFalse,
    getDefualt,
    getSuggestions,
    createBookShelf,
    saveBook,
    displaySuggestions

  })(Home)

