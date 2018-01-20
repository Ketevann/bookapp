import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button } from './common';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Card, Icon } from 'react-native-elements'
import { clearPreferences } from '../redux/actions/preferencesActions';
//import Dimensions from 'Dimensions'
import Deck from './Deck';
var { height, width } = Dimensions.get('window');

class Book extends Component {

  replaceZoomDigit(link) {
    console.log(link, 'link', link.replace(/zoom=[0-9]/, 'zoom=0'))
    return link.replace(/zoom=[0-9]/, 'zoom=0')

  }
  onEnd(){
    const userId = this.props.auth.userId;
    this.props.clearPreferences(userId)
  }

  render() {

    const   { loggedIn } = this.props.auth
    const   { book } = this.props
     console.log(this.props, ' in BOOK', book)
     let modifiedLink;

    return (

      
        <Deck
          data={this.props.book}
          onSwipeRight={this.props.onSaveBook}//passing save/delete suggestions function as props
          onSwipeLeft={this.props.onRemoveBook}
          onEnd={ this.onEnd.bind(this) }
        />


    );
  }
}




const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8ff',

    display: 'flex',
  },
  image: {
    flex: 1,
    width: width,
    height: height
  }
});


export default connect(({ auth , preferences }) => ({ auth: auth , preferences: preferences}), { clearPreferences})(Book)

