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
  ScrollView
} from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';

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
      onStartShouldSetPanResponder: () => {
        this.setState({allowScroll: false })
        return true
      },
      //detects movement
      onPanResponderMove: (event, gesture) => {

        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      //detects release
      onPanResponderRelease: (event, gesture) => {
         this.setState({allowScroll: true })
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position, index: 0, description: '', title: '', allowSwipe: true };
  }

componentWillMount(){
  console.log('this.tate', this.state)
     this.getDescription()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  componentWillUpdate() {
    console.log('in will update ---------->', this.state.index)

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
    //direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item.title);//for dislike on swipe we only need a title to remove from user suggestion in db




    this.state.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
    if (direction === 'right')
     {onSwipeRight(item)
     this.getDescription()
    }
     else {
       onSwipeLeft(item.title)
       this.getDescription()
     }
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }// there was glitch on rest. card was not returning to original position
    }).start();
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
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
   // console.log(this.props.data, 'dta', this.state.index)
    return this.props.data.map((item, i) => {
     // console.log(i, ' entered loop', item, this.props.data.length)
      if (i < this.state.index) {
       // console.log('index is null should be the fist card', this.state.index, i)
        return null; }

      if (i === this.state.index) {
        // console.log('index is equal thos should animate', this.state.index, i, item.title,' item')
        return (
          <View>
         <Animated.View
            key={i}
            style={[this.getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
            {...this.state.panResponder.panHandlers}
          >
            {this.renderCard(item, i)}
          </Animated.View>
          </View>
        );
      }

      if (i > this.state.index){
       //  console.log('index is greater', 'state', this.state.index, 'index', i, item.title)

      return (
        <View>
        <Animated.View
          key={i}
          style={[styles.cardStyle]}
        >
          {this.renderCard(item, i)}
        </Animated.View>

        </View>
      );}

    }).reverse()
  }


renderText(item){
  console.log()
  return(
    <ScrollView
    contentContainerStyle={this.props.contentContainerStyle}
    >
    <Text>{item.description}</Text>
    </ScrollView>
  )
}
  renderCard(item, index) {
   // this.getDescription()
 //   console.log('in render Card', item.title, 'title =======>>>')




    let modifiedLink = 'https://vignette.wikia.nocookie.net/fantendo/images/6/6e/Small-mario.png/revision/latest?cb=20120718024112'
    if (item.imageLinks) {
      //   console.log(item.imageLinks.smallThumbnail, ' links')
      modifiedLink = item.imageLinks.smallThumbnail.replace(/zoom=[0-9]/, 'zoom=0')
    }
    return (
      <ScrollView>
      <Animated.View style={{ backgroundColor: 'white' }}
        key={index}
      >
       <Text>{item.author}</Text>
        <Image
          source={{ uri: modifiedLink }} style={{ width: width - 40, height: height - 300 }} />

      </Animated.View>

          </ScrollView>
    );
  }

  renderNoMoreCards() {
    this.setState({description: '', title: ''})
    this.props.onEnd(); //deletes prefrences when user reaches end of book suggestions
    return (
      <Card title="All Done!">
        <Text style={{ marginBottom: 10 }}>
          There's no more content here!
        </Text>

        <Button
          backgroundColor="#03A9F4"
          title="Update Preferences"
          onPress={() => Actions.preferencesForm()}
        />
      </Card>
    );
  }

  getDescription(){
    const {index} = this.state
    console.log(index, 'get descrtiption index state')
    const description = this.props.data.filter((elem, i) =>{

        if(i === index) {
           console.log('i and book', i, elem)
          return elem;}
    })

    this.setState({ description: description[0].description, title: description[0].title })
  }
  render() {
    console.log('this.', this.props, this.state.index,' index')



    const { imageLinks, title } = this.props.data,
      { book } = this.props
    return (
      <View

      >

<ScrollView
scrollEnabled={this.state.allowScroll}>


        {this.renderCards()}
        <View
        style={{flexDirection: 'row', marginTop: 220, alignItems: 'center'}}
        >
         <Icon
            raised
            name='close'
            type='Foundation'
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
            name='heart'
            type='font-awesome'
            color='#f50'
            size={25}
            onPress={() => this.forceSwipe('right')}//sabes a "liked" book to users branch on swipe right
          />
        </View>

          <Text>{this.state.title}</Text>
          <Text>{this.state.description}</Text>
          </ScrollView>
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
