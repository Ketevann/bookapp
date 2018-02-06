import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import firebase from 'firebase';
import { connect } from 'react-redux';
import {
  updateDefaultSuggestions,
  getDefualt, getSuggestions,
  clearSearchBooks, findSimilarBooks,
  loadingSearchResults, updateErr
} from '../actions/bookActions';
import { scale, verticalScale, moderateScale } from '../utils/functions';
import { Icon } from 'react-native-elements';

export default Err = (props) => {
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
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: scale(10),
    width:  scale(250),
    height: verticalScale(115),
    marginBottom: verticalScale(55),
    borderRadius:10
  },
   errorTextStyle: {
    marginTop: verticalScale(5),
    color: '#f50',
    fontSize: scale(17),
    textAlign: 'center',
    fontFamily: 'Avenir-Book'
  }
});

