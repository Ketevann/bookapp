import React from 'react';
import { Text, View, TextInput, Dimensions, PixelRatio } from 'react-native';
const { height, width } = Dimensions.get('window');
import { LinearGradient } from 'expo';

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);



import {scale, verticalScale, moderateScale } from '../../functions'


const Input = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
  const { inputStyle, labelStyle, containerStyle,ViewStyle, placeholderStyle } = styles;

  return (
    <View
      style={ViewStyle}   >


      <Text >{label}</Text>
      <TextInput
        placeholderTextColor="#9B9B9"
        style={containerStyle}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}

        value={value}
        onChangeText={onChangeText}
      />
      <LinearGradient
        colors={['#9E81C6', '#3F529C']}
        style={{alignItems: 'center', height: 1, width: (width / 1.5) }}

      >

      </LinearGradient>
    </View>
  );
};

const styles = {
  ViewStyle: {
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
  }
};
export { Input };
