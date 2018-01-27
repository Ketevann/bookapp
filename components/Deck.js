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
} from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import { Spinner } from './common';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const { height, width } = Dimensions.get('window');

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => { },
    onSwipeLeft: () => { }
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: () => true,
      //detects movement
      onPanResponderMove: (event, gesture) => {
        if (Math.abs(gesture.dx) < Math.abs(gesture.dy)) {
          position.setValue({ x: 0, y: 0 });
        } else if (Math.abs(gesture.dx) > (15)) {
          this.state.position.setValue({ x: gesture.dx, y: 0 });
        }
      },
      //detects release
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD
          && (gesture.dy >= -150 && gesture.dy <= 150)) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD
          && (gesture.dy >= -150 && gesture.dy <= 150)) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position, index: 0, loadingImage: true };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
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
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      easing: Easing.linear
    }).start(() => this.onSwipeComplete(direction));
  }
  resetPosition() {
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
            style={[styles.cardStyle, { zIndex: 99 }, this.getCardStyle(),
            { height }]}
            {...this.state.panResponder.panHandlers}
          >
            {this.renderCard(item, i)}
          </Animated.ScrollView>
        );
      }
      if (i > this.state.index) {
        return (
          <Animated.ScrollView
            key={i}
            style={[styles.cardStyle, { top: 10 * (i - this.state.index), zIndex: 0 }]}
          >
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
        style={{
          backgroundColor: 'white',
          height: SCREEN_HEIGHT
        }}
        key={index}
      >
        <Text
          ref={'author' + this.state.index}
        >{item.author}</Text>
        <Image
          source={{ uri: modifiedLink }}
          style={{ width: width - 40, height: height - 300 }}
          onLoadStart={(e) => this.setState({ loadingImage: true })}
          onLoad={() => this.setState({ loadingImage: false, error: false })} />
        {
          this.state.loadingImage ?
            <View style={styles.imageContainer}>
              <Spinner />
            </View>: 
            <Text ref={this.state.index}>
              {item.description}
            </Text> 
        }
      </Animated.ScrollView>
    );
  }

  renderNoMoreCards() {
    this.props.onEnd(); //deletes prefrences when user reaches end of book suggestions
    return (
      <Card title="All Done!">
        <Text style={{ marginBottom: 10 }}>
          There's no more content here!
        </Text>

        <Button
          backgroundColor="#03A9F4"
        />
      </Card>
    );
  }

  render() {
    return (
      this.renderCards()
    );
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    flex: 1,
  },
  container: {

    justifyContent: 'center',
    backgroundColor: 'white'
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
    height: 0.50 * Dimensions.get('window').height,
    borderRadius: 10
  },
  imageContainer: {
    width: width - 40,
    height: height - 250,
    backgroundColor: 'white',
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Deck;
