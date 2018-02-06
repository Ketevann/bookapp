import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { scale, verticalScale, moderateScale } from '../utils/functions';
import { getSavedBooks } from '../actions/bookActions';
import { Icon } from 'react-native-elements/';


class Footer extends Component {

  getBooks() {
    if (this.props.auth.userId) {
      this.props.getSavedBooks(this.props.auth.userId)
      Actions.profile({ user: this.props.auth.userId })
    } return null;
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={{marginLeft: scale(13)}}>
            <Icon
              name='home'
              type='SimpleLineIcons'
              color='white'
              underlayColor='#3B509A' // set the underlayColor of the view used behind the icon
              size={scale(35)}
              onPress={() => Actions.home()} />
          </TouchableOpacity>
          <TouchableOpacity>
           <Icon
              name='heart'
              type='font-awesome'
              color='white'
              underlayColor='#3B509A' //  set the underlayColor of the view used behind the icon
              size={scale(30)}
              onPress={() => this.getBooks()} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container:{
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0 
  },
  iconsContainer:{
    flexDirection: 'row', 
    backgroundColor: '#3B509A', 
    justifyContent: 'space-around',
    height: verticalScale(50), 
    padding: scale(10)
  }
});

export default connect(
  ({ book, auth }) => ({ book, auth }),
  { getSavedBooks })(Footer);

