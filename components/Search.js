import { SearchBar } from 'react-native-elements'
import React, { Component } from 'react';
import { Text, View, TextInput, Keyboard, Dimensions, PixelRatio } from 'react-native';
import { connect } from 'react-redux';
import { Button } from './common';
import firebase from 'firebase';
import {
  setSearchValue,
  findSimilarBooks,
  changeSearchBookQuery
} from '../redux/actions/bookActions';
const { height, width } = Dimensions.get('window');
import Search from 'react-native-search-box';

import { scale, verticalScale, moderateScale } from '../functions'
import { Actions } from 'react-native-router-flux';

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);
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


  // Important: You must return a Promise
  beforeFocus = () => {
    return new Promise((resolve, reject) => {
      console.log('beforeFocus');
      resolve();
    });
  }

  // Important: You must return a Promise
  onFocus = (text) => {
    return new Promise((resolve, reject) => {
      console.log('onFocus', text);
      resolve();
    });
  }

  // Important: You must return a Promise


  // Important: You must return a Promise
  onFocus = (text) => {
    return new Promise((resolve, reject) => {
      console.log('onFocus', text);
      resolve();
    });
  }

  // Important: You must return a Promise

  afterFocus = () => {
    return new Promise((resolve, reject) => {
      console.log('afterFocus');
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
          <View
            style={viewStyle}
          >
            <Text
              style={[headerTextStyle, this.state.book, bookTextStyle]}
              onPress={() => this.onSetSearchQuery('books')}>Books</Text>
            <Text
              style={[headerTextStyle, this.state.author, authorTextStyle]}
              onPress={() => this.onSetSearchQuery('author')}>Authors</Text>
            <View
              style={{ marginLeft: 36 }}
            >
              <Icon
                name='search'
                type='evilIcons'
                color='#FAFAFA'
                size={25}
                onPress={() => this.setState({ search: !this.state.search })}//deletes a "disliked book from users suggestions"
              />
            </View>
            {this.props.auth.userId ?
             <Text style={[headerTextStyle, {marginLeft: 20}]} onPress={() => {
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
          /**
          * There many props that can customizable
          * Please scroll down to Props section
          */
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
    marginLeft: 40
  },
  bookTextStyle: {
    marginLeft: 30,
  }
}
export default connect(({ book, auth }) =>
  ({ book, auth }), {
    setSearchValue,
    findSimilarBooks,
    changeSearchBookQuery
  })(SearchComponent)
