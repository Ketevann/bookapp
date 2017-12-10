import { SearchBar } from 'react-native-elements'
import React, { Component } from 'react';
import { Text, View, TextInput, Keyboard } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import LoginForm  from './common/LoginForm'
import {
  setSearchValue,
findSimilarBooks } from '../redux/actions/bookActions'
import { connect } from 'react-redux'
import {Actions} from 'react-native-router-flux';

class Search extends Component {

// componentDidMount() {
//   this.search.focus()
// }


bla(){
  console.log('cancel')
  this.search.blur()
}

handleSubmit(){
  console.log(this.props.book.searchbooks)
  const {searchbooks} = this.props.book
  this.props.findSimilarBooks(searchbooks)
}

onSearchChange(searchbooks){
console.log(searchbooks,' search')
  this.props.setSearchValue(searchbooks)
}
  render(){
    {console.log('book', this.props)}
    return(
      <View>
      <SearchBar
      onPress={()=> this.search.focus()}
       ref={search => this.search = search}
  round
  clearIcon
  onSubmitEditing={()=> this.handleSubmit()}
  onChangeText={()=> console.log('text')}
  returnKeyType='search'
  onChangeText={this.onSearchChange.bind(this)}
  value={this.props.book.searchbooks}
  placeholder='Similar authors/book titles' />
  <Button onPress={() => this.bla()}>cancel</Button>
   <TextInput
        onSubmitEditing={Keyboard.dismiss}
      />
  </View>
    )
  }

}
export default connect(({ book }) => ({ book: book }), {setSearchValue, findSimilarBooks})(Search)
