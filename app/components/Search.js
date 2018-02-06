import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import { Text, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  setSearchValue,
  findSimilarBooks,
  changeSearchBookQuery
} from '../actions/bookActions';
import Search from 'react-native-search-box';
import { scale, verticalScale } from '../utils/functions';
import { Actions } from 'react-native-router-flux';
import { LinearGradient } from 'expo';
import { Icon } from 'react-native-elements';

class SearchComponent extends Component {
  static defaultProps = {
    clearBooks: () => { },//defualt function
  }
  constructor() {
    super()
    this.state = { book: { textDecorationLine: 'underline' }, author: { textDecorationLine: 'none' }, search: false }
  }
  onSearchChange(searchbooks) {
    this.props.setSearchValue(searchbooks);
  }

  onSetSearchQuery(query) {
    console.log('set query', query)
    if (query === 'books') this.setState({
      book: { textDecorationLine: 'underline' },

      author: { textDecorationLine: 'none' }
    })
    else if (query === 'author') this.setState({ author: { textDecorationLine: 'underline' }, book: { textDecorationLine: 'none' } })
    this.props.changeSearchBookQuery(query);
  }

  beforeFocus = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  onFocus = (text) => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  onFocus = (text) => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  afterFocus = () => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  render() {
    { console.log('book', this.props) }
    const { headerTextStyle, authorTextStyle, bookTextStyle, viewStyle } = styles;
    return (
      <View style={{ zIndex: 1000 }}>

        <LinearGradient
          colors={['#B88FD2', '#3C509B']}
          start={[1, 0]} end={[0, 0]}
        >
          <View style={viewStyle} >
            <Text
              style={[headerTextStyle, this.state.book, bookTextStyle]}
              onPress={() => this.onSetSearchQuery('books')}>Books</Text>
            <Text
              style={[headerTextStyle, this.state.author, authorTextStyle]}
              onPress={() => this.onSetSearchQuery('author')}>Authors</Text>
            <View
              style={{ marginLeft: scale(28) }}
            >
              <Icon
                name='search'
                type='evilIcons'
                color='#FAFAFA'
                underlayColor='rgba(0, 0, 0, 0)'
                size={scale(25)}
                onPress={() => this.setState({ search: !this.state.search })}//deletes a "disliked book from users suggestions"
              />
            </View>
            {this.props.auth.userId ?
             <Text style={[headerTextStyle, {marginLeft: scale(30)}]} onPress={() => {
               firebase.auth().signOut()
               Actions.home()
            }}>Log Out</Text>
            :null}
          </View>
        </LinearGradient>

        {this.state.search ?

          <Search
            ref="search_box"
            placeholder={this.props.book.placeholder}
            autoCapitalize='words'
            blurOnSubmit
            keyboardDismissOnSubmit
            returnKeyType='search'
            onSearch={() => this.props.handleSubmit()}
            onChangeText={this.onSearchChange.bind(this)}
            value={this.props.book.searchbooks}
            placeholder='Search'
            backgroundColor='rgba(142, 142, 147, 0.5)'
            tintColorSearch='rgba(142, 142, 147, 0.5)'
            onCancel={()=>this.props.clearBooks()} //if props are passed, call that function, else nothing happens
            onDelete={()=>this.props.onDelete()}
          />
          : null}
      </View>
    )
  }
}


const styles = {
  viewStyle: {
    flexDirection: 'row',
    height: verticalScale(30),
    marginTop: verticalScale(15)
  },
  headerTextStyle: {
    fontSize: scale(16),
    fontFamily: 'Avenir-Book',
    backgroundColor: 'transparent',
    color: '#FAFAFA'
  },
  authorTextStyle: {
    marginLeft: scale(40)
  },
  bookTextStyle: {
    marginLeft: scale(20),
  }
}
export default connect(({ book, auth }) =>
  ({ book, auth }), {
    setSearchValue,
    findSimilarBooks,
    changeSearchBookQuery
  })(SearchComponent)