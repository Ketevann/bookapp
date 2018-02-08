
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions , Router} from 'react-native-router-flux';
import { connect } from 'react-redux';
import { scale, verticalScale, moderateScale } from '../utils/functions';
import { getSavedBooks } from '../actions/bookActions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



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
          <TouchableOpacity style={ styles.icon }>
            <Icon
              name={'home-outline'}
              color='#fff'
              underlayColor='#3B509A' // set the underlayColor of the view used behind the icon
              size={scale(24)}
              onPress={() => Actions.home()} />
              <Text style={ styles.text }>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ styles.icon }>
           <Icon
              name={'heart-outline'}
              color='#fff'
              underlayColor='#3B509A' //  set the underlayColor of the view used behind the icon
              size={scale(24)}
              onPress={() => this.getBooks()} />
                <Text style={ styles.text }>Favorites</Text>
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
    bottom: 0, 
  },
  iconsContainer:{
    flexDirection: 'row', 
    backgroundColor: '#3B509A', 
    justifyContent: 'space-around',
    height: verticalScale(56), 
    paddingTop: verticalScale(8),
    paddingBottom:scale(10),
    paddingLeft: scale(13)
  },
  text:{
    color:'#fff', 
    fontFamily: 'System',
    textAlign:'center', 
    fontSize:scale(10) 
  },
  icon:{
     flexDirection: 'column',  
     justifyContent:'center', 
     alignItems:'center'
  }
});

export default connect(
  ({ book, auth }) => ({ book, auth }),
  { getSavedBooks })(Footer);
