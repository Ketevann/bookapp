import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity,
  PixelRatio,
  Dimensions,
  PanResponder
} from 'react-native';
import { Spinner } from './common';
import { getSavedBooks, removeBooks, markAsRead } from '../actions/bookActions';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements'
import { scale, verticalScale, moderateScale } from '../utils/functions'

const { height, width } = Dimensions.get('window');
let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);

class BookCard extends Component {
  constructor(props) {
    super(props)
    this.state = { index: 0, value: 0, loading: true, loadingImage: true, front:true }
  }

  componentWillMount() {
    if (this.props.books.image) {
      this.setState({ loading: false });
    }
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.currentCard = 0
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });

    this.wrapperPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => true,
      onPanResponderGrant: () => {
          //console.log('GRANTED TO WRAPPER');
      },
      onPanResponderMove: (evt, gestureState) => {
          //console.log('WRAPPER MOVED');
      }
    });

    this.scollerPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, g) => true,
      onPanResponderGrant: () => {
          //console.log('GRANTED TO SCROLLER');
      },
      onPanResponderMove: (evt, gestureState) => {
          //console.log('SCROLLER MOVED');
      }
    });
  }

  frontCardStyle() {
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });
    const frontAnimatedStyle = {
      transform: [{ rotateY: this.frontInterpolate }]
    };
    return frontAnimatedStyle;
  }

  backCardStyle() {
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    });
    const backAnimatedStyle = {
      transform: [{ rotateY: this.backInterpolate }]
    };
    return backAnimatedStyle;
  }

  flipCard() {
     this.setState({ front: !this.state.front });
    if (this.value >= 90) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10
      }).start();
    } else if (this.value < 90) {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10
      }).start();
    }
  }
  onUpdateBook(title, type) {
    this.props.updateFilteredBooks ? this.props.updateFilteredBooks(title, type) : null;//checks if filterUpdate function exists then call it, else do nothing
  }                                                                                     //if we are displaying searched books, then the filterUpdated functuion exists
  onDelete(title) {
    this.props.removeBooks(this.props.auth.userId, title);//updating the db
    this.onUpdateBook(title, 'delete');//updating the display of searched books
  }

  onRead(title) {
    this.props.markAsRead(this.props.auth.userId, title); //updating the db
    this.onUpdateBook(title, 'read');//updating the display of searched books
  }

  renderElemets(book) {
    let color;
    if (book.read === true) {
      color = '#f50';
    } else color = 'gray';
    let modifiedLink;
    if (book.image.smallThumbnail) {
      modifiedLink = book.image.smallThumbnail.replace(/zoom=[0-9]/, 'zoom=0')
    }
    if (book) {
      if (!this.state.loading) {
        return (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity onPress={() => this.flipCard()} >
              <Animated.View
               style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Animated.Image
                  source={{ uri: modifiedLink }}
                  style={[this.frontCardStyle(), styles.cardStyle]}
                  onLoadStart={(e) => this.setState({ loadingImage: true })}
                  onLoad={() => this.setState({ loadingImage: false, error: false })}
                />
              </Animated.View>
              <Animated.View style={[this.backCardStyle(), styles.cardStyle, styles.flipCardBack, { justifyContent: 'center', alignItems: 'center'} ]}>
                <ScrollView {...this.wrapperPanResponder.panHandlers} contentContainerStyle={{ paddingBottom: scale(10) }} >
                  <View style={{ flex: 1 }} {...this.scollerPanResponder.panHandlers} >
                    <Text
                      style={styles.textStyle}
                    >Page Count: {book.pageCount}</Text>
                    <Text
                      style={styles.textStyle}
                    >category: {book.categories[0]}</Text>
                  </View>
                  <Text
                    style={[styles.textStyle,  {textAlign: 'center'}]}
                  >{book.description}</Text>
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>

             {
              this.state.loadingImage === true ?
               <View style={styles.imageContainer}>
                 <Spinner />
              </View> :
              <Animated.View style={[ {display: this.state.front ? 'flex': 'none'}, styles.buttons ]}>
                <View style={{ position: 'relative', left: -1* scale(40) }}>
                  <Icon
                    raised
                    name='delete'
                    type='delete'
                    color='#F38D8D'
                    size={ scale(20) }
                    onPress={() => this.onDelete(book.title)}
                  />
                </View>
                <View style={{ position: 'relative', left: scale(40) }} >
                  <Icon
                    raised
                    name='check'
                    type='font-awesome'
                    color={color}
                    size={scale(20)}
                    onPress={() => this.onRead(book.title)}
                  />
                </View>
              </Animated.View>
            }
            {
              this.state.loadingImage === true ? null :
              <Animated.View style={{ flexDirection: 'column' ,paddingBottom: scale(15)}} >
                <View style={styles.title}>
                  <Text style={styles.textStyle}> {book.title}  </Text>
                  <Text style={styles.author}> by {book.author}</Text>
                </View>
              </Animated.View>
            }
          </View>
        );
      }
    }
    return <Spinner size="large" />
  }
  render() {
    return (
      this.renderElemets(this.props.books)
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  cardStyle: {
    height: verticalScale(400),
    width: scale(250),
    backfaceVisibility: 'hidden',
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    width: 300,
    alignItems: 'center',
    borderRadius: 10,
    height: 500
  },
  flipCardBack: {
    position: "absolute",
    flexDirection:'row',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {//styling for image spinner
    height: 425,
    width: 250,
    backgroundColor: '#E5EAEF',
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontSize: scale(15),
    fontFamily: 'Avenir-Book',
    color: '#050F37',
    marginTop: 5,
    textAlign: 'center'
  },
  author:{
    fontSize: scale(15),
    fontFamily: 'Avenir-Book',
    color: '#050F37',
    paddingBottom: 15
  },
  title:{
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttons:{
    marginTop: -1 * scale(50),
    height:50,
    flexDirection: 'row',
    alignItems:'flex-end',
    justifyContent: 'space-around'
  }
});

export default connect(
  ({ auth }) => ({ auth }),
  {
    getSavedBooks,
    removeBooks,
    markAsRead
  })(BookCard);