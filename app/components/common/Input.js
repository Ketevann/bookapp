import React from 'react';
import { Text, View, TextInput, Dimensions, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo';
import {scale, verticalScale, moderateScale } from '../../utils/functions';

const { height, width } = Dimensions.get('window');

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);


const Input = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, labelStyle, containerStyle,ViewStyle, placeholderStyle } = styles;

  return (
    <View style={styles.viewStyle} >
      <Text >{label}</Text>
      <TextInput
        style={containerStyle}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
      />
      <LinearGradient colors={['#9E81C6', '#3F529C']} style={styles.linearGradient} />
    </View>
  );
};

const styles = {
  viewStyle: {
    marginLeft: scale(50) ,
    backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: scale(14),
  },
  border: {
    borderWidth: 1
  },
  containerStyle: {
    backgroundColor: 'white',
    paddingBottom: scale(15),
    fontFamily: 'Avenir-Book'
  },
  placeholderStyle: {
    fontSize: scale(14),
    fontFamily: 'Avenir-Book',
    color: 'green'
  },
  linearGradient:{
    alignItems: 'center', 
    height: verticalScale(1), 
    width: (width / 1.5) 
  }
};

export { Input };
