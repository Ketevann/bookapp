import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  PanResponder,
  TouchableOpacity
} from 'react-native';
import { Header, CardSection, Spinner, Button } from './common'
import { getSavedBooks, removeBooks, markAsRead } from '../redux/actions/bookActions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import axios from 'axios';
import Dimensions from 'Dimensions'
import AnimatedFlick from './AnimatedFlick';
var { height, width } = Dimensions.get('window')
import { Card, Icon } from 'react-native-elements'
import BookCard from './BookCard'

class SavedBooks extends Component {

  constructor(props) {
    super()
  }


  render() {
    return (
 null
    )
  }
}







const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#FFF',

  },

  imageStyle: {

    position: 'absolute',

    top: 0,

    left: 0,

    bottom: 0,

    right: 0,

  },

  cardStyle: {

    height: 400, width: 250, backfaceVisibility: 'hidden',

  },



  flipCardBack: {

    position: "absolute",

    top: 0,

  },





});



export default connect(

  ({ auth, preferences, book }) => ({ auth: auth, preferences: preferences, book: book }),

  {



    getSavedBooks,

    removeBooks,

    markAsRead

  })(SavedBooks)
