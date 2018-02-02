import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { scale, verticalScale, moderateScale } from '../utils/functions';
import { getSavedBooks } from '../actions/bookActions';
import { Icon } from 'react-native-elements/';

const { height, width } = Dimensions.get('window');

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);

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
          flexDirection: 'row', backgroundColor: '#3B509A', justifyContent: 'space-around',
          height: scale(50), padding: scale(10)
        }}>
          <TouchableOpacity style={{marginLeft: 13}}>
            <Icon
              name='home'
              type='SimpleLineIcons'
              color='white'
              underlayColor='#3B509A' // set the underlayColor of the view used behind the icon
              size={35}
              onPress={() => Actions.home()} />
          </TouchableOpacity>
          <TouchableOpacity>
           <Icon
              name='heart'
              type='font-awesome'
              color='white'
              underlayColor='#3B509A' //  set the underlayColor of the view used behind the icon
              size={30}
              onPress={() => this.getBooks()} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default connect(
  ({ book, auth }) => ({ book, auth }),
  { getSavedBooks })(Footer);

