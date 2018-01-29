import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo';


const { height, width } = Dimensions.get('window');

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);



const Button = ({ onPress, children }) => {
  const { textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress}>

       <LinearGradient
        colors={['#A082C7', '#3F529C']}
        style={{alignItems: 'center', height: 40, width: (width / 1.5), marginLeft: SCREEN_WIDTH * (50 / SCREEN_WIDTH) }}
      >
      <Text style={styles.textStyle}>
        {children}
      </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
     backgroundColor: 'transparent',
     fontFamily: 'Avenir-Book',
     color: 'white',
     padding: 10,
    fontSize: SCREEN_WIDTH * (17 / SCREEN_WIDTH),




  }

};

export { Button };
