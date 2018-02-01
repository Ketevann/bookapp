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
  Dimensions
} from 'react-native';
import { Spinner } from './common';

import { getSavedBooks, removeBooks, markAsRead } from '../redux/actions/bookActions';
import { connect } from 'react-redux';

import { Icon } from 'react-native-elements'
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};



const { height, width } = Dimensions.get('window');

import { scale, verticalScale, moderateScale } from '../functions'

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);


class BookCard extends Component {
  constructor(props) {
    super(props)
    this.state = { index: 0, value: 0, loading: true, loadingImage: true }
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
  }                                                                             //if we are displaying searched books, then the filterUpdated functuion exists
  //if we are displaying saved books then filterUpdated functuion does not exist
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

            <TouchableOpacity
              onPress={() => this.flipCard()}
            >
              <Animated.View>
                {/*<Animated.Image
                  style={[this.frontCardStyle(), styles.cardStyle]}
                  source={{ uri: book.image.smallThumbnail }}
                />*/}
                <Animated.Image
                  source={{ uri: book.image.smallThumbnail }}
                  style={[this.frontCardStyle(), styles.cardStyle]}
                  onLoadStart={(e) => this.setState({ loadingImage: true })}
                  onLoad={() => this.setState({ loadingImage: false, error: false })}
                />

                {this.state.loadingImage === true ? <View style={styles.imageContainer}>
                  <Spinner />
                </View> :
                  <View>
                    <Text
                      style={styles.textStyle}
                    >{book.title}  </Text>
                    <Text
                      style={{
                        fontSize: scale(15),
                        fontFamily: 'Avenir-Book',
                        color: '#050F37',
                        paddingBottom: 15
                      }}
                    >by {book.author}</Text>
                  </View>

                }

              </Animated.View>
              <Animated.View style={[this.backCardStyle(), styles.cardStyle, styles.flipCardBack]} >
                <ScrollView
                  onTouchStart={(e) => this.props.disableParentScroll(false)}
                  onTouchEnd={(e) => this.props.disableParentScroll(true)}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={styles.textStyle}
                    >Page Count: {book.pageCount}</Text>
                    <Text
                      style={styles.textStyle}
                    >category: {book.categories[0]}</Text>
                  </View>
                  <Text
                    style={styles.textStyle}

                  >{book.description}</Text>
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>
            <Animated.View
              style={{ flexDirection: 'row' }}
            >
              <View
                style={{ position: 'relative', left: -40 }}
              >
                <Icon
                  raised
                  name='delete'
                  type='delete'
                  color='#F38D8D'
                  size={30}
                  onPress={() => this.onDelete(book.title)}
                />
              </View>

              <View
                style={{ position: 'relative', left: 40 }}
              >
                <Icon

                  raised
                  name='check'
                  type='font-awesome'
                  color={color}
                  size={30}
                  onPress={() => this.onRead(book.title)}
                />
              </View>
            </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10

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
    top: 0,
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
    marginTop: 5
  }

});

export default connect(
  ({ auth }) => ({ auth }),
  {
    getSavedBooks,
    removeBooks,
    markAsRead
  })(BookCard);