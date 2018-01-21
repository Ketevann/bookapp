import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button, Spinner } from './common';
import { connect } from 'react-redux';
import { clearPreferences, removeSuggestion } from '../redux/actions/preferencesActions';
import { saveBook } from '../redux/actions/bookActions';
import Deck from './Deck';
var { height, width } = Dimensions.get('window');

class Book extends Component {

  onEnd() {
    const userId = this.props.auth.userId;
    this.props.clearPreferences(userId)
  }

  onSaveBook(book) {
    const userId = this.props.auth.userId;
    this.props.removeSuggestion(book.title, userId);
    this.props.saveBook(book, userId)
  }

  onRemoveBook(book) {
    const userId = this.props.auth.userId;
    console.log("dislike ", book, " ", userId)
    this.props.removeSuggestion(book, userId)
  }

  render() {
    const { loggedIn } = this.props.auth,
      { preferences, loading } = this.props.preferences;

    return (
      (preferences && !loading) ? //checking if books are in state
        <Deck
          contentContainerStyle={{ flexDirection: 'row', zIndex: 500, top: height - 275, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
          data={preferences}//passing suggested books
          onSwipeRight={this.onSaveBook.bind(this)} //passing save/delete suggestions function as props
          onSwipeLeft={this.onRemoveBook.bind(this)}
          onEnd={this.onEnd.bind(this)}
        /> : <Spinner size='large' />
    );
  }
}


export default connect(({ auth, preferences }) => ({ auth: auth, preferences: preferences }), {
  clearPreferences,
  removeSuggestion,
  saveBook
})(Book)

