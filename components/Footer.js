import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { getSavedBooks } from '../redux/actions/bookActions';

class Footer extends Component {

  getBooks() {
    if (this.props.auth.userId) {
      this.props.getSavedBooks(this.props.auth.userId)
      Actions.profile({ user: this.props.auth.userId })
    } return null;
  }
  render() {
    return (
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View style={{
          flexDirection: 'row', backgroundColor: 'lightgray',
          justifyContent: 'space-around',
          height: 40
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
            onPress={() => this.getBooks()}>
            <Image
              style={{ width: 27, height: 27, padding: 10, marginTop: 5 }}
              source={require('../img/heart2.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


export default connect(
  ({ book, auth }) => ({ book, auth }),
  { getSavedBooks })(Footer);

