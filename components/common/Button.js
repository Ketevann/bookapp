import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo';


const { height, width } = Dimensions.get('window');
import {scale, verticalScale, moderateScale } from '../../functions'

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);



const Button = ({ onPress, children }) => {
  const { textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress}>
     <View
     style={{marginTop: scale(40)}}>

      <Text style={styles.textStyle}>
        {children}
      </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
     backgroundColor: '#f4426b',
     fontFamily: 'Avenir-Book',
     color: 'white',
     padding: 10,
    fontSize: SCREEN_WIDTH * (17 / SCREEN_WIDTH),
    height: 40, width: (width / 1.5), marginLeft: SCREEN_WIDTH * (50 / SCREEN_WIDTH)




  }

};

export { Button };
