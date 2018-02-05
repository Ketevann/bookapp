import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Text,
  Image,
  Easing,
  PixelRatio
} from 'react-native';
import { connect } from 'react-redux';
import { checkSaved, updateErrDisplay} from '../actions/bookActions';
import { Card, Button, Icon } from 'react-native-elements';
import { Spinner } from './common';
import { scale, verticalScale, moderateScale } from '../utils/functions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const { width } = Dimensions.get('window');

let PIXEL_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let PIXEL_HEIGHT = PixelRatio.getPixelSizeForLayout

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => { },
    onSwipeLeft: () => { }
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.state.panResponderEnabled,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      //detects movement
      onPanResponderMove: (event, gesture) => {
        if (this.state.panResponderEnabled) {
          this.state.position.setValue({ x: gesture.dx, y: gesture.dy });
        }
      },
      //detects release
      onPanResponderEnd: (event, gesture) => {
        console.log('ended')
      },

      onPanResponderRelease: (event, gesture) => {
        if (this.state.panResponderEnabled) {
          if (gesture.dx > SWIPE_THRESHOLD) {
            this.forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            this.forceSwipe('left');
          } else {
            this.resetPosition();
          }
        }
      }
    });

    this.state = { panResponder, position, index: 0, loadingImage: true, scroll: false, panResponderEnabled: true, SCREEN_HEIGHT, style: { paddingBottom: 0 }, totop: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  componentDidMount(){//checking if the first card on deck has been saved previous
    this.props.checkSaved( this.props.data[this.state.index].title, this.props.userId )
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item.title);//for dislike on swipe we only need a title to remove from user suggestion in db
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
     if (this.state.index < this.props.data.length){ //check if the current card has been saved before
       this.props.checkSaved( this.props.data[this.state.index].title, this.props.userId)
     }
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-10deg', '0deg', '10deg']
    });
    return [{
      ...position.getLayout(),
      transform: [{ rotate }],
      opacity: this.state.position.x.interpolate({ inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH], outputRange: [0.5, 1, 0.5] })
    }];
  }

  forceSwipe(direction) {
    if (this.props.book.duplicateTitle === this.props.data[this.state.index].title && direction ==='right'){//reset cover position and display error 
     this.resetPosition()
     this.props.updateErrDisplay(true);
   } else {   
     this.setState({ scroll: false, panResponderEnabled: true, style: { paddingBottom: 0 }, totop: false })
      const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
      Animated.timing(this.state.position, {
        toValue: { x, y: 0 },
        duration: SWIPE_OUT_DURATION,
        easing: Easing.linear
      }).start(() => this.onSwipeComplete(direction));
    }
  }

  resetPosition() {
    console.log('rsetting')
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }// there was glitch on rest. card was not returning to original position
    }).start();
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.renderNoMoreCards();
    }
    return this.props.data.map((item, i) => {
      if (i < this.state.index) {
        return null;
      }
      if (i === this.state.index) {
        return (
          <Animated.ScrollView
            key={i}
            scrollEnabled={this.state.scroll}//added Scroll enables
            style={[styles.cardStyle, { zIndex: 99, height: SCREEN_HEIGHT}, this.getCardStyle()]}
            scrollEnabled={this.state.scroll}//added Scroll enables
            {...this.state.panResponder.panHandlers}
            scrollsToTop={this.state.totop}
          >
            {this.renderCard(item, i)}
          </Animated.ScrollView>
        );
      }
      if (i > this.state.index) {
        return (
          <Animated.ScrollView
            key={i}
            style={[styles.cardStyle, { zIndex: 0,    height: SCREEN_HEIGHT }]}>
            {this.renderCard(item, i)}
          </Animated.ScrollView>
        );
      }
    }).reverse();
  }

  renderCard(item, index) {
    let modifiedLink = item.imageLinks.smallThumbnail;
    if (item.imageLinks) {
      modifiedLink = item.imageLinks.smallThumbnail.replace(/zoom=[0-9]/, 'zoom=0')
    }
    return (
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: scale(50) }}
        ref="_scrollView"
        style={{marginTop: verticalScale(45),
          backgroundColor: 'white',
          borderRadius: 5,
          paddingBottom: verticalScale(10),
          height: SCREEN_HEIGHT - 140
       }}
      >
        <View ref="_View" style={{borderRadius: 70}}>
          <Image
            source={{ uri: modifiedLink }}
            resizeMode='cover'
            borderRadius={10}
            style={{
              width: width - scale(40),
              height: SCREEN_HEIGHT - verticalScale(290),
              borderRadius: 22,
              marginLeft: scale(18),
              marginTop: verticalScale(10)
            }}
            onLoadStart={(e) => this.setState({ loadingImage: true })}
            onLoad={() => this.setState({ loadingImage: false, error: false })} />
        </View>
        {
          this.state.loadingImage ?
            <View style={styles.imageContainer}>
              <Spinner />
            </View> :
            <View
              style={{
                marginTop: verticalScale(25),
                marginLeft: scale(18)
              }}
            >
              <Text style={styles.titleTextStyle} ref={'author' + this.state.index}>
                {item.title}
              </Text>
              <Text style={styles.authorTextStyle}>
                by {item.author}
              </Text>
              <View style={{ flexDirection: 'row', zIndex: 500, position: 'absolute', top: verticalScale(-80), justifyContent: 'space-between' }} >
                <View style={{ left: scale(-10) }}>
                  <Icon
                    raised
                    name='close'
                    type='Foundation'
                    color='#f50'
                    size={25}
                    onPress={() => this.forceSwipe('left')}//deletes a "disliked book from users suggestions"
                  />
                </View>
                <View style={{ left: scale(55), top: verticalScale(20)}}>
                  <Icon
                    name='arrow-drop-down-circle'
                    type='materialIcons'
                    color='#3C509B'
                    size={scale(35)}
                    onPress={() => {
                      console.log(this.state, ' in scroll')
                      let totop = false
                      if (this.state.scroll === true) {
                        totop = true
                      }
                      this.setState({ scroll: !this.state.scroll, panResponderEnabled: !this.state.panResponderEnabled, totop })
                    }} //sabes a "liked" book to users b
                  />
                </View>
                <View style={{ left: scale(120) }} >
                  <Icon
                    raised
                    name='check'
                    type='feather'
                    color='#3C509B'
                    size={25}
                    onPress={() => this.forceSwipe('right')}//sabes a "liked" book to users branch on swipe right
                  />
                </View>
              </View>
            </View>
        }
        {
          this.state.scroll ?
            <View>
              <Text
                style={{
                  marginTop: scale(7),
                  fontSize: scale(15),
                  fontFamily: 'Avenir-Book',
                  color: '#050F37',
                  marginLeft: scale(18)
                }}
              >Page Count: {item.pageCount}</Text>
              <Text
                style={{
                  fontSize: scale(15),
                  fontFamily: 'Avenir-Book',
                  color: '#050F37',
                  marginLeft: scale(18)
                }}
              >Category: {item.categories[0]}</Text>
              <Text
                style={styles.description}
              >
                {item.description}
              </Text>
            </View> : null
        }
      </Animated.ScrollView>
    );
  }

  renderNoMoreCards() {
    this.props.onEnd(); //deletes prefrences when user reaches end of book suggestions
    return (
      <View
        style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.errorViewStyle}>
          <Text style={[{ marginBottom: 10 }, styles.errorTextStyle]}>
            There's no more content here!
        </Text>
        </View>
      </View>
    );
  }

  render() {
    console.log(this.props, this.state, 'panResponder', this.state.panResponderEnabled)
    return (
      this.renderCards()
    );
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  },
  container: {
    justifyContent: 'center',
    backgroundColor: 'white'
  },

  titleTextStyle: {
    fontSize: scale(15),
    fontFamily: 'Avenir-Book',
    color: '#050F37',
   // color: 'white'
  },
  authorTextStyle: {
    fontSize: scale(13),
    fontFamily: 'Avenir-Book',
    color: '#050F37',
    paddingBottom: verticalScale(15),
    //color: 'white'
  },

  description: {
    fontSize: scale(15),
    fontFamily: 'Avenir-Book',
    color: '#050F37',
    marginLeft: scale(18),
    width: width - scale(40),
    top: verticalScale(5),
    paddingBottom: verticalScale(25),
    marginTop: verticalScale(5),
   // color: 'white'
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  innerContainer: {
    // justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    width: 0.75 * SCREEN_WIDTH,
    borderRadius: 10
  },
  imageContainer: {
    width: width - 40,
    height: SCREEN_HEIGHT - 250,
    backgroundColor: 'white',
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorViewStyle: {
    backgroundColor: '#F38D8D',
    height: verticalScale(60),
    marginTop: verticalScale(150)

  },
  errorTextStyle: {
    marginTop: verticalScale(5),
    color: '#FFFFFF',
    fontSize: scale(17),
    textAlign: 'center',
    padding: scale(10),
    fontFamily: 'Avenir-Book'

  }
};

//export default Deck;
export default connect(
 ({ book }) => ({ book }), {
    checkSaved,updateErrDisplay
  })(Deck);

