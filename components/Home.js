import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Spinner } from './common';
import {
  loginDispatch,
  loginDispatchFalse
} from '../redux/actions/authActions';
import {
  updateDefaultSuggestions,
  getDefualt, getSuggestions,
  clearSearchBooks, findSimilarBooks,
  loadingSearchResults
} from '../redux/actions/bookActions';
import Book from './Book';
import Search from './Search';

class Home extends Component {

  componentWillMount() {
    if (this.props.book && this.props.book.similarbooks) {
    }
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
    const { searchbooks, placeholder } = this.props.book;
    this.props.loadingSearchResults();
    const userId = this.props.auth.userId;
    this.props.findSimilarBooks(searchbooks, placeholder, userId);
  }

  display() {
    const { similarbooks, loading } = this.props.book;
    if (this.props.book && similarbooks) {
      if (similarbooks.length === 0)
        return <Text>Your Search returned no results </Text>
      return (<Book data={similarbooks} loading={loading} />)
    }
  }

  render() {
    const userId = this.props.auth.userId;
    const { similarbooks, loadingSavedBook } = this.props.book;
    return (
      <View style={{ flex: 1 }}>
        { loadingSavedBook ? <Spinner size="large" /> : this.display() }
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
  ({ book, auth }) => ({ book, auth }),
  {
    loginDispatch,
    loginDispatchFalse,
    getDefualt,
    getSuggestions,
    updateDefaultSuggestions,
    clearSearchBooks,
    findSimilarBooks,
    loadingSearchResults
  })(Home);
