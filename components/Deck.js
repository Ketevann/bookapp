import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Text,
  Image
} from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
var { height, width } = Dimensions.get('window');

class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => { },
    onSwipeLeft: () => { }
  }

  constructor(props) {
    super(props);
    //initialize animation valueXY deals with gestures and exposes x, y
    //default is {x:0, y :0}
    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      //detects touch
      onStartShouldSetPanResponder: () => true,
      //detects movement
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      //detects release
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position, index: 0 };
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

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item.title);//for dislike on swipe we only need a title to remove from user suggestion in db
    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }// there was glitch on rest. card was not returning to original position 
    }).start();
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.renderNoMoreCards();
    }
    console.log(this.props.data, 'dta', this.state.index)
    return this.props.data.map((item, i) => {
      if (i < this.state.index) { return null; }

      if (i === this.state.index) {
        return (
         <Animated.View
            key={i}
            style={[this.getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
            {...this.state.panResponder.panHandlers}
          >
            {this.renderCard(item, i)}
          </Animated.View>
        );
      }


      return (
        <Animated.View
          key={item.id}
          style={[styles.cardStyle, { top: 10 * (i - this.state.index), zIndex: 5 }]}
        >
          {this.renderCard(item, i)}
        </Animated.View>
      );
    });
  }



  renderCard(item, index) {
    console.log('render car', item)
    if (item.imageLinks.smallThumbnail) {
      //   console.log(item.imageLinks.smallThumbnail, ' links')
      modifiedLink = item.imageLinks.smallThumbnail.replace(/zoom=[0-9]/, 'zoom=0')
    }
    return (  
      <Animated.View style={{ backgroundColor: 'white' }}
        key={index}
      >
       <Text>{item.author}</Text>
        <Image
          source={{ uri: modifiedLink }} style={{ width: width - 40, height: height - 300 }} />
        {/*<View
          style={{ flexDirection: 'row' }}
        >
          <Icon
            raised
            name='like'
            type='font-awesome'
            color='#f50'
            size={25}
          />
          <Icon
            raised
            name='cross'
            type='cog'
            color='#f50'
            size={25}
          />
        </View>
        <Button
          icon={{ name: 'code' }}
          backgroundColor="#03A9F4"
          title="View Now!"
        />*/}
      </Animated.View>
    );
  }

  renderNoMoreCards() {
    return (
      <Card title="All Done!">
        <Text style={{ marginBottom: 10 }}>
          There's no more content here!
        </Text>
        <Button
          backgroundColor="#03A9F4"
          title="Get more!"
        />
      </Card>
    );
  }


  render() {
    const { imageLinks, title } = this.props.data,
      { book } = this.props
    return (
      <View> 
        {this.renderCards()}<View
          style={{ flexDirection: 'row', zIndex: 500 , top: height - 275, backgroundColor:'white', justifyContent: 'center', alignItems: 'center'}}
          //this keeps the buttons from traveling with each card. buttons remain in position as user swioes but functionality is passed to the next card 
        ><Icon
            raised
            name='like'
            type='font-awesome'
            color='#f50'
            size={25}
           onPress={() => this.forceSwipe('left')}//deletes a "disliked book from users suggestions"
          />
          <Button
          icon={{ name: 'code' }}
          backgroundColor="#03A9F4"
          title="View Now!"
        /><Icon
            raised
            name='cross'
            type='cog'
            color='#f50'
            size={25}
            onPress={() => this.forceSwipe('right')}//sabes a "liked" book to users branch on swipe right
          />
        </View>
      </View>
    );
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
};

export default Deck;
