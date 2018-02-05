import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal, Dimensions } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import {
  updateDefaultSuggestions,
  getDefualt, getSuggestions,
  clearSearchBooks, findSimilarBooks,
  loadingSearchResults, updateErr
} from '../actions/bookActions';
import { scale, verticalScale, moderateScale } from '../utils/functions';
import { Card, Button, Icon } from 'react-native-elements';

export default Err = (props) => {
    console.log (props, "errorActive")
  return (
    <View style={{ flex: 1 }}>
         <Modal
              visible={props.errorActive}
              animationType={'fade'}
              transparent={true}
              onRequestClose={() => this.closeModal()}
          >
            <View style={styles.modalContainer}>
              <View style={styles.innerContainer}>
                <Text style={[ {marginTop: verticalScale(10)}, styles.errorTextStyle ]}>{ props.errorActive}</Text>
                <Text style={ styles.errorTextStyle }>{ props.message }</Text>
                 <Icon
                    name='close'
                    type='materialIcons'
                    color='#3C509B'
                    size={scale(35)}
                    onPress={() => props.closeModal()}
                  />
              </View>
            </View>
          </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    //backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: scale(10),
    width: scale(0.80) * Dimensions.get('window').width,
    height: verticalScale(0.20) * Dimensions.get('window').height,
    marginBottom: verticalScale(0.10) * Dimensions.get('window').height,
    borderRadius:10
  },
   errorTextStyle: {
    marginTop: verticalScale(5),
    color: '#f50',
    fontSize: scale(17),
    textAlign: 'center',
    //padding: 10,
    fontFamily: 'Avenir-Book'
  }
});

