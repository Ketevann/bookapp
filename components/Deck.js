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
  Easing,
  ScrollView,
} from 'react-native';
import { Card, Button, Icon } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import {  Spinner } from './common'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 100;
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

//  this._opacityAnimation = this._animatedValue.x.interpolate({
//     inputRange: [0, 150],
//     outputRange: [1, 0.2]
// });


 const panResponder = PanResponder.create({

      // onPanResponderStart : () => {
      //     // this.texate({ scrollActive:false } )
      //       //console.log('touched ', this.state.scrollActive)
      // },

      //detects touch


        onStartShouldSetPanResponder: () => true,


      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: () => true,
      //detects movement
      onPanResponderMove: (event, gesture) => {
        console.log('moving ', gesture.dx, SWIPE_THRESHOLD)
        console.log('------------- ', gesture.dx, "---",gesture.dy, "0-0-0", 0.1 * SCREEN_WIDTH )
        if (Math.abs(gesture.dx)<Math.abs(gesture.dy)){
             position.setValue({ x: 0, y: 0});
        } else  if ( Math.abs(gesture.dx) > (15) ){
            this.state. position.setValue({ x: gesture.dx, y: 0});
        } 
      },



//       onPanResponderEnd: (e, gesture) => {
//         console.log('onEnd ', gesture.dx, gesture.dy, SWIPE_THRESHOLD, gesture.dx > SWIPE_THRESHOLD, gesture.dx < -SWIPE_THRESHOLD)
//         if (gesture.dx > SWIPE_THRESHOLD) {
//            console.log(' gesture greater than swipe', gesture.dx , SWIPE_THRESHOLD )
//           this.forceSwipe('right');
//         } else if (gesture.dx < -SWIPE_THRESHOLD) {
//           console.log(' gesture less than - swipe', gesture.dx , -SWIPE_THRESHOLD )
//           this.forceSwipe('left');
//         }
//         else if (gesture.dy < -15 || gesture.dy > 15 ){
//           Animated.spring(this.state.position, {
//       toValue: { x: 0, y: 0 }// there was glitch on rest. card was not returning to original position
//     }).start();
//         }


//         else {
//           this.resetPosition();
//         }
// },






      //detects release
      onPanResponderRelease: (event, gesture) => {
        console.log('onTerminate')
        console.log('realeased ', gesture.dx, gesture.dy,  SWIPE_THRESHOLD, gesture.dx > SWIPE_THRESHOLD, gesture.dx < -SWIPE_THRESHOLD)
        if (gesture.dx > SWIPE_THRESHOLD && (gesture.dy >= -150 && gesture.dy <= 150 )) {
           console.log(' gesture greater than swipe', gesture.dx , SWIPE_THRESHOLD )
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD &&(gesture.dy >= -150 && gesture.dy <= 150 )) {
          console.log(' gesture less than - swipe', gesture.dx , -SWIPE_THRESHOLD )
          this.forceSwipe('left');
        }
    //      else if (gesture.dy < -5 || gesture.dy > 5 ){
    //       Animated.spring(this.state.position, {
    //   toValue: { x: 0, y: 0 }// there was glitch on rest. card was not returning to original position
    // }).start();
    //     }
        else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position, index: 0, scrollActive:false,  modalVisible: false, description: '', title: '', page: '', category: '', txtheight: SCREEN_HEIGHT , loadingImage:true};
  }
  componentWillMount() {
     this.setState({scrollActive: true})
   // console.log('this.tate', this.state)
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
   // console.log(bool, 'boooooool======<')
    this.setState({ scrollActive:bool } )
  }
  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: 250,
      easing: Easing.linear
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    this.setState({scrollActive: true})
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
      outputRange: ['-10deg', '0deg', '10deg']
    });

    return [{
      ...position.getLayout(),
      transform: [{ rotate }],
            opacity: this.state.position.x.interpolate({inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH], outputRange: [0.5, 1, 0.5] })

    }];
  }

  renderCards() {

    // const containerStyle = {
    //   opacity: this.state.position.x.interpolate({
    //     inputRange: [0, 150],
    // outputRange: [1, 0.2]
    //   }),
    //   transform: [
    //     {
    //       scale: this.state.position.x.interpolate({
    //         inputRange: [0, 150],
    //       outputRange: [1, 0.2]
    //       }),
    //     },
    //   ],
    // };



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
          <Animated.ScrollView
            key={i}
            style={[ styles.cardStyle, { zIndex: 99 }, this.getCardStyle(),{ height:height}]}
            {...this.state.panResponder.panHandlers}
          >

            {this.renderCard(item, i)}
          </Animated.ScrollView>
        );
      }

      if (i > this.state.index) {
        //  console.log('index is greater', 'state', this.state.index, 'index', i, item.title)

        return (
          <Animated.ScrollView
            key={i}
            style={[styles.cardStyle, { top: 10 * (i - this.state.index), zIndex: 0}]}
          >
            {this.renderCard(item, i)}
          </Animated.ScrollView>
        );
      }
    }).reverse()
  }



  renderCard(item, index) {
    //   console.log('in render Card', item.title, 'title =======>>>')
   const setStyle = () => {

    console.log('in set Styke', index, this.state.index)
    let visibility = 'flex'
    if (index > this.state.index) {
        return {
          display: 'none'
        }
      }
       return {
          fontSize: 20
        }
    }
    let modifiedLink = item.imageLinks.smallThumbnail;
    if (item.imageLinks) {
      //   console.log(item.imageLinks.smallThumbnail, ' links')
      modifiedLink = item.imageLinks.smallThumbnail.replace(/zoom=[0-9]/, 'zoom=0')
    }
     let deckRef= 'deck' + this.state.index;
     console.log(deckRef, ' DECK RECF')
    return (
      <Animated.ScrollView style={{ backgroundColor: 'white', height: this.state.txtheight }}
        key={index}

      >
        <Text
        ref={'author'+ this.state.index}
        >{item.author}</Text>
        {/*<Image
        ref={'image'+ this.state.index}
          source={{ uri: modifiedLink }} style={{ width: width - 40, height: height - 300 }} />*/}
           <Image
              ref={'image'+ this.state.index}
              source={{ uri: modifiedLink }} 
              style={{ width: width - 40, height: height - 300 }}
              onLoadStart={(e) => this.setState({loadingImage: true})}
              onLoad={() => this.setState({loadingImage: false, error: false})}/>

       { this.state.loadingImage === true ? <View style={styles.imageContainer}>
                                              <Spinner/>
                                            </View> : null }

          <Text
 ref={this.state.index}

          >{item.description}</Text>
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
          //title="Update Preferences"
          //onPress={() => Actions.preferencesForm()}
        />
      </Card>
    );
  }
  getDescription() {
    const { index } = this.state

   // console.log(index, 'get descrtiption index state')
    if (index >= this.props.data.length) {
      this.setState({ description: "", title: "", page: '', category: '' })
      return null;
    }

    const currentCard = this.props.data.filter((elem, i) => {

      if (i === index) {
     //   console.log('i and book', i, elem)
        return elem;
      }
    })
    const details = currentCard[0];
    this.setState({ description: details.description, title: details.title, page: details.pageCount, category: details.categories[0] })
  }

  measureHeader() {
    console.log('measure head!!!!!!!===========>')
  //  if (this.refs.myInput)
  let measurement = {}
    this.refs[this.state.index].measure((ox, oy, width, height) => {
      console.log('DEEEECCCCC,', height)
      var calc = SCREEN_HEIGHT - height
      var H = height * (SCREEN_HEIGHT/ height)

      //this.setState({txtheight: SCREEN_HEIGHT + calc});
      measurement.height = height;

       let deckRef = 'author'+this.state.index;
      //console.log(deckRef, ' iin MESURE')
      this.refs[deckRef].measure((ox, oy, width, height) => {
      console.log('height, in AUTHOOOOR', height)
      measurement.height += height;
      //console.log('measureeeee', measurement, SCREEN_HEIGHT)
    })

       let imageRef = 'image'+this.state.index;
        this.refs[imageRef].measure((ox, oy, width, height) => {
      console.log('height, in IAMGEEEE', height)
      measurement.height += height;
      if (measurement.height < SCREEN_HEIGHT){
        this.state.position.setValue({x: 0, y:0})
this.setState({txtheight:  SCREEN_HEIGHT, scrollActive: false })
      }
    else  this.setState({txtheight:  measurement.height, scrollActive: true })

    })

 console.log(measurement, 'author image height', this.state.position)
 });



  }
  render() {
   // console.log('this.', this.props, this.state.scrollActive)
    const { imageLinks, title } = this.props.data,
      { book } = this.props
      console.log(this.state.scrollActive, 'height of scroll in state', this.state.txtheight, SCREEN_HEIGHT)
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
   imageContainer:{
     width: width - 40, 
     height: height - 250, 
     backgroundColor:'white' , 
     position:'absolute', 
     flex:1, 
     flexDirection:'row', 
     alignItems:'center',
     justifyContent:'center'
   }
};

export default Deck;