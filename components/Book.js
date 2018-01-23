import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button, Spinner} from './common';
import { connect } from 'react-redux';
import { clearPreferences , removeSuggestion} from '../redux/actions/preferencesActions';
import { saveBook } from '../redux/actions/bookActions';
import Deck from './Deck';

class Book extends Component {

  onEnd(){
    const userId = this.props.auth.userId;
    this.props.clearPreferences(userId)
  }

  onSaveBook(book) {
    const userId = this.props.auth.userId;
    this.props.removeSuggestion(book.title, userId );
    this.props.saveBook(book, userId )
  }

  onRemoveBook(book) {
    const userId = this.props.auth.userId;
    console.log( "dislike ", book, " ",userId)
    this.props.removeSuggestion(book, userId )
  }

  render(){
    const { loggedIn } = this.props.auth,
          { data, loading } = this.props;

    return (
      (data && !loading ) ? //checking if books are in state
        <Deck
          data={data}//passing suggested books
          onSwipeRight={ this.onSaveBook.bind(this) } //passing save/delete suggestions function as props
          onSwipeLeft={ this.onRemoveBook.bind(this) }
          onEnd={ this.onEnd.bind(this) }
        /> : <Spinner size='large' />
    );
  }
}


export default connect(({ auth }) => ({ auth }), {
    clearPreferences,
    removeSuggestion,
    saveBook
  })(Book);
