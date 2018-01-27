import { SearchBar } from 'react-native-elements'
import React, { Component } from 'react';
import { Text, View, TextInput, Keyboard } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import LoginForm from './common/LoginForm'
import {
  setSearchValue,
  findSimilarBooks,
  changeBook,
  changeSearchBookQuery
} from '../redux/actions/bookActions'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux';

class Search extends Component {

  onSearchChange(searchbooks) {
    this.props.setSearchValue(searchbooks);
  }

  onSetSearchQuery(query) {
    this.props.changeSearchBookQuery(query);
  }
  cancelSearch() {
    this.search.blur();
  }

  render() {
    // {console.log('book', this.props)}
    return (
      <View style={{ zIndex: 1000 }}>
        <Text onPress={() => this.onSetSearchQuery('book')}>Books</Text>
        <Text onPress={() => this.onSetSearchQuery('author')}>Authors</Text>
        <SearchBar
          onPress={() => this.search.focus()}
          ref={search => this.search = search}
          round
          clearIcon
          onSubmitEditing={() => this.props.handleSubmit()}
          onChangeText={() => console.log('text')}
          returnKeyType='search'
          onChangeText={this.onSearchChange.bind(this)}
          value={this.props.book.searchbooks}
          placeholder={this.props.book.placeholder} />
        <Button onPress={() => this.cancelSearch()}>cancel</Button>
        <TextInput
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
    )
  }

}
export default connect(({ book }) =>
  ({ book }), {
    setSearchValue,
    findSimilarBooks,
    changeSearchBookQuery
  })(Search)
