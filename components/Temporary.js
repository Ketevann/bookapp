import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
import { getBookSuggestions, saveBook, createBookShelf } from '../redux/actions/bookActions';
import { getPreferences, } from '../redux/actions/preferencesActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { Actions} from 'react-native-router-flux';
import { connect } from 'react-redux';
import   firebase from 'firebase';
import   defaultBooks  from './data/defaultBooks';
import   Book from './Book';
import   axios  from 'axios';
import Search from './Search'
import { width, height, totalSize } from 'react-native-dimension';

class Temporary extends Component {

  componentWillMount(){
      if (defaultBooks){
        console.log(defaultBooks, "default");
        //this.props.getBookSuggestions(defaultBooks.list);
      }else{
        console.log("defaultList not loaded");
      }

      firebase.auth().onAuthStateChanged((user) => {
        console.log((this.props, ' in authfirebase', user));
        if (user) {
          this.props.loginDispatch(user.uid)
          this.props.getPreferences(this.props.auth.userId)//saving preferences from firebase to redux state
          //console.log(this.props.preferences.preferences, "-->in home.js")//trying to use preferences. this console.log seems to activate before the console log in the redux function
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
          { loggedIn } = this.props.auth,
          { preferences } = this.props.preferences;
          { console.log( this.props,"preferences=======================================>" )}


    return (

      <ScrollView style={styles.container}>
      <Search />
      <View>


      {this.props.book && this.props.book.similarbooks ?
        this.props.book.similarbooks.map(allbooks=>

       (<ScrollView>
          <Text style={{padding: 10}}>{allbooks.title}</Text>
          <Text style={{padding: 10}}>{allbooks.description}</Text>
          {allbooks.imageLinks?
           <Image
          style={{width: 150, height: 200}}
          source={{uri: `${allbooks.imageLinks.thumbnail}`}}
        />
        : <Image
          style={{width: 150, height: 200}}
          source={{uri: `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/No_image_3x4.svg/1024px-No_image_3x4.svg.png`}}
        />}
        </ScrollView>)

      ) : null}

      </View>

       </ScrollView>
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
  canvas:
    {flex: 1,
        alignSelf: 'stretch',
        width: width(50),
        height: height(70)}
});

export default connect(
    ({ book, auth, preferences }) => ({ book: book, auth: auth, preferences: preferences  }),
    { loginDispatch, loginDispatchFalse,
      getPreferences,
      getBookSuggestions,
      createBookShelf,
      saveBook
   })(Temporary)

