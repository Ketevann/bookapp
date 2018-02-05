import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal, Dimensions } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Spinner } from './common';
import { loginDispatch, loginDispatchFalse } from '../actions/authActions';
import {
  updateDefaultSuggestions,
  getDefualt, getSuggestions,
  clearSearchBooks, findSimilarBooks,
  loadingSearchResults, updateErrDisplay
} from '../actions/bookActions';
import Book from './Book';
import SearchComponent from './Search';
import { scale, verticalScale, moderateScale } from '../utils/functions';
import { Icon } from 'react-native-elements';
import Login from './Login';
import Error from './Error'; 
class Home extends Component {
  componentWillMount() {
    this.props.clearSearchBooks();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.loginDispatch(user.uid);
        this.props.getSuggestions(user.uid);//if logged in, then check for saved preferences, loads either preferred books or defualt(if there are no preferences) to state
        //this.props.updateDefaultSuggestions();//updating defualt books branch
      } else {
        this.props.loginDispatchFalse();
        this.props.getDefualt(); //if not logged in, then loads defualt books to state
      }
    });
  }

  handleSubmit() {
    console.log('in o hanlr', this.props)
    const { searchbooks, placeholder } = this.props.book;
    this.props.loadingSearchResults();
    const userId = this.props.auth.userId;
    this.props.findSimilarBooks(searchbooks, placeholder, userId);
  }

  display() {   
    const { similarbooks, loading, error } = this.props.book;
    const userId = this.props.auth.userId;
    if (this.props.book && similarbooks) {
      if (similarbooks.length === 0)
        return <Text style={[ {marginTop: scale(10)}, styles.errorTextStyle ]} >Your search returned no results </Text>
      return (<Book data={similarbooks} loading={loading} error={error} />)
    }
  }

  closeModal() {
   this.props.updateErrDisplay(false);
  }

  render() {
    console.log(this.props, 'home')
    const { loadingCreditionals, userId } = this.props.auth;
    const { similarbooks, loadingSavedBook, errorActive, error, title, displayModal } = this.props.book;
    
    if (loadingCreditionals || loadingSavedBook) {//loadingCreditionals is boolean, display as spinner cuz otherwise when user is loggedin, the sign in form flashes briefly.
      return <Spinner size="large" />
    }
    else  if (!this.props.auth.loggedIn) { //display login form if not signed.
      return <Login />;
    } else return (
      <View style={{ flex: 1 }}>
        <SearchComponent handleSubmit={this.handleSubmit.bind(this)} />
        {this.display()}
        <Error  
          errorActive={this.props.book.errorActive} 
          message={error} 
          title={title}
          closeModal={ this.closeModal.bind(this) }
        />
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
    errorTextStyle: {
    marginTop: 5,
    color: '#f50',
    fontSize: scale(17),
    textAlign: 'center',
    //padding: 10,
    fontFamily: 'Avenir-Book'
  }
});

export default connect(
  ({ book, auth }) => ({ book, auth }),
  {
    loginDispatch,
    loginDispatchFalse,
    getDefualt,
    getSuggestions,
    updateDefaultSuggestions,
    clearSearchBooks,
    findSimilarBooks,
    loadingSearchResults,
    updateErrDisplay
  })(Home);
