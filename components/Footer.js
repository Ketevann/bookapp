import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
import { getBookSuggestions, saveBook, createBookShelf } from '../redux/actions/bookActions';
import { getPreferences, } from '../redux/actions/preferencesActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import defaultBooks from './data/defaultBooks';
import Book from './Book';
import axios from 'axios';
import Search from './Search'

class Footer extends Component {



  render() {
    {console.log(this.props, ' footer')}
    return (

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View style={{
          flexDirection
          : 'row', backgroundColor: 'lightgray',
          justifyContent: 'space-around',
          height:40
        }}>

         <TouchableOpacity
            onPress={() => Actions.home()}>
          <Image
            style={{ width: 27, height: 27, padding: 10, marginTop: 5 }}
            source={require('../img/home.png')}
          />
          </TouchableOpacity>
          <Image
            style={{ width: 27, height: 27, padding: 10, marginTop: 5 }}
            source={require('../img/user1.png')}
          />
          <TouchableOpacity
            onPress={() => Actions.savedbooks()}>
            <Image

              style={{ width: 27, height: 27, padding: 10, marginTop: 5 }}
              source={require('../img/heart2.png')}
            />
          </TouchableOpacity>
        </View>
      </View>

      )
  }
}


export default connect(
  ({ book, auth, preferences }) => ({ book: book, auth: auth, preferences: preferences }),
  null)(Footer)
