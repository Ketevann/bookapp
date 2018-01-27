import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
//import { getSuggestions,getDefualt, updateDefaultSuggestions } from '../redux/actions/preferencesActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { updateDefaultSuggestions, getDefualt, getSuggestions, clearSearchBooks, findSimilarBooks, loadingSearchResults } from '../redux/actions/bookActions'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions'
var { height, width } = Dimensions.get('window')
import firebase from 'firebase';
import Book from './Book';
import Search from './Search'
class Home extends Component {

  constructor(){
    super()
  }
  componentWillMount() {
    if(this.props.book && this.props.book.similarbooks ){
     console.log('got books')
    }
    this.props.clearSearchBooks();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.loginDispatch(user.uid);
        this.props.getSuggestions(user.uid);//if logged in, then check for saved preferences, loads either preferred books or defualt(if there are no preferences) to state
        //this.props.updateDefaultSuggestions();//updating defualt books branch
      }
      else {
        this.props.loginDispatchFalse()
        this.props.getDefualt() //if not logged in, then loads defualt books to state
      }
    })
  }


handleSubmit(){
  console.log(this.props.book.searchbooks)
  const {searchbooks, placeholder} = this.props.book
  this.props.loadingSearchResults();
  const userId = this.props.auth.userId;
  this.props.findSimilarBooks(searchbooks, placeholder,userId);
}

display(){
      const { loggedIn } = this.props.auth
 //   { console.log(this.props, "preferences") }
    const { preferences, loading } = this.props.preferences;
    const { similarbooks } = this.props.book;


   if(this.props.book && similarbooks ){
     console.log('got books')
    // this.setState({loading: false})
     if (similarbooks.length === 0)
     return  <Text>Your Search returned no results </Text>
         return  (<Book data={similarbooks} loading={loading} />)
   }
             return (<Book data={preferences} loading={loading} />)


}

  render() {
    const { loggedIn } = this.props.auth
    const userId = this.props.auth.userId;

    //{ console.log(this.props, "preferences") }
    const { preferences, loading } = this.props.preferences;
    const { similarbooks } = this.props.book;

    return (

      <View style={{ flex: 1 }}>
        <Search handleSubmit={this.handleSubmit.bind(this)} userId={userId} />
         { (this.props.book.loadingSavedBook   /*|| loading*/)?

               <Spinner size="large" />
          :

        this.display()
         }

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
    updateDefaultSuggestions,
    clearSearchBooks,
    findSimilarBooks,
    loadingSearchResults

  })(Home)
