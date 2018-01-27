import { SearchBar } from 'react-native-elements'
import React, { Component } from 'react';
import { Text, View, TextInput, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Button } from './common';
import {
  setSearchValue,
  findSimilarBooks,
  changeSearchBookQuery
} from '../redux/actions/bookActions';


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
