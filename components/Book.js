import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button, Spinner} from './common';
import { connect } from 'react-redux';
import { saveBook , removeSuggestion} from '../redux/actions/bookActions';
import Deck from './Deck';

class Book extends Component {

  onEnd(){
    const userId = this.props.auth.userId;
  }
  onSaveBook(book) {
    const userId = this.props.auth.userId;
    this.props.removeSuggestion(book.title, userId );
    this.props.saveBook(book, userId )
  }

  onRemoveBook(book) {
    const userId = this.props.auth.userId;
    this.props.removeSuggestion(book, userId )
  }

  render() {
   const { data } = this.props;

    return (
      data ? //checking if books are in state
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
    //clearPreferences,
    removeSuggestion,
    saveBook
  })(Book);
