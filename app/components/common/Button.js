import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo';
import {scale, verticalScale, moderateScale } from '../../utils/functions';
const { height, width } = Dimensions.get('window');

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);


const Button = ({ onPress, children }) => {
  const { textStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress}>
     <View style={{ alignItems: 'center', marginTop: scale(40)}}>
        <LinearGradient colors={['#A082C7', '#3F529C'] } 
         start={[1, 0]} end={[0, 0]}
         style={styles.linearGradient} >
        <Text style={styles.textStyle}>
          {children}
        </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Avenir-Book',
    color: 'white',
    padding: scale(10),
    fontSize: SCREEN_WIDTH * (17 / SCREEN_WIDTH),
  },
  linearGradient:{ 
    height: scale(40), 
    width: (width / 1.5), 
  }
};

export { Button };
