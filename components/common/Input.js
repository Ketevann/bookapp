import React from 'react';
import { Text, View, TextInput, Dimensions, PixelRatio } from 'react-native';
const { height, width } = Dimensions.get('window');
import { LinearGradient } from 'expo';

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);






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
  marginLeft: SCREEN_WIDTH * (50 / SCREEN_WIDTH) ,
  backgroundColor: 'white'
  },
  labelStyle: {
    fontSize: SCREEN_WIDTH * (14 / SCREEN_WIDTH),

  },
  border: {
    borderWidth: 1
  },
  containerStyle: {
    backgroundColor: 'white',
    paddingBottom: SCREEN_WIDTH * (15 / SCREEN_WIDTH),
    fontFamily: 'Avenir-Book'
  },
  placeholderStyle: {
    fontSize: SCREEN_WIDTH * (14 / SCREEN_WIDTH),
    fontFamily: 'Avenir-Book',
    color: 'green'
  }
};
export { Input };
