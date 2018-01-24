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
  Modal,
  ScrollView,

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
         this.setState({ scrollActive:false } )
       return true;
      },
      //detects movement
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      //detects release
      onPanResponderRelease: (event, gesture) => {
        this.setState({ scrollActive:true } )
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position, index: 0,scrollActive:true,  modalVisible: false, description: '', title: '', page: '', category: '' };
  }
  componentWillMount() {
    console.log('this.tate', this.state)
    this.getDescription()
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
  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }


  disableParentScroll(bool){
    console.log(bool, 'boooooool======<')
    this.setState({ scrollActive:bool } )
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
    this.getDescription()
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
        return null;
      }

      if (i === this.state.index) {
        // console.log('index is equal thos should animate', this.state.index, i, item.title,' item')
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

      if (i > this.state.index) {
        //  console.log('index is greater', 'state', this.state.index, 'index', i, item.title)

        return (
          <Animated.View
            key={i}
            style={[styles.cardStyle, { top: 10 * (i - this.state.index), zIndex: 5 }]}
          >
            {this.renderCard(item, i)}
          </Animated.View>
        );
      }
    }).reverse()
  }



  renderCard(item, index) {
    //   console.log('in render Card', item.title, 'title =======>>>')




    let modifiedLink = item.imageLinks.smallThumbnail;
    if (item.imageLinks) {
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
  getDescription() {
    const { index } = this.state

    console.log(index, 'get descrtiption index state')
    if (index >= this.props.data.length) {
      this.setState({ description: "", title: "", page: '', category: '' })
      return null;
    }

    const currentCard = this.props.data.filter((elem, i) => {

      if (i === index) {
        console.log('i and book', i, elem)
        return elem;
      }
    })
    const details = currentCard[0];
    this.setState({ description: details.description, title: details.title, page: details.pageCount, category: details.categories[0] })
  }

  render() {
    console.log('this.', this.props)
    const { imageLinks, title } = this.props.data,
      { book } = this.props
    return (
      <ScrollView
      scrollEnabled={this.state.scrollActive}

      >
        {this.renderCards()}<View
          style={{zIndex: 500, marginTop:300, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
        //this keeps the buttons from traveling with each card. buttons remain in position as user swioes but functionality is passed to the next card
        ><Icon
            raised
            name='close'
            type='Foundation'
            color='#f50'
            size={25}
            onPress={() => this.forceSwipe('left')}//deletes a "disliked book from users suggestions"
          />

          <Icon
            raised
            name='heart'
            type='font-awesome'
            color='#f50'
            size={25}
            onPress={() => this.forceSwipe('right')}//sabes a "liked" book to users branch on swipe right
          />


              <Text style={{ paddingBottom: 20, justifyContent: 'center', }}>{this.state.title}</Text>



              <Text>Page Count</Text>
              <Text>{this.state.page}</Text>

              <Text>Category</Text>
              <Text>{this.state.category}</Text>



                  <Text  /*style={{textAlign:"center", textAlignVertical:"center"}}*/>{this.state.description}</Text>

        </View>


      </ScrollView>
    );
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
};

export default Deck;