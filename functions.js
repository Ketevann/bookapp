import { Dimensions, PixelRatio } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 640;
const guidelineBaseHeight = 1136;
let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);


const scale = size =>

{

  return SCREEN_WIDTH / guidelineBaseWidth * size;

}
const verticalScale = size => SCREEN_HEIGHT / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + ( scale(size) - size ) * factor;

export {scale, verticalScale, moderateScale }