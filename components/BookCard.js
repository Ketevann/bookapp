import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity
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

class BookCard extends Component {
  constructor(props) {
    super(props)
    this.state = { index: 0, value: 0, loading: true , loadingImage: true }
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

  onDelete(title) {
    this.props.removeBooks(this.props.auth.userId, title)
  }

  onRead(title) {
    this.props.markAsRead(this.props.auth.userId, title)
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
          <View>
            <Text
              style={{
                fontFamily: 'Helvetica'
              }}
            >{book.title}</Text>
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
                  onLoadStart={(e) => this.setState({loadingImage: true})}
                  onLoad={() => this.setState({loadingImage: false, error: false})}
                />

                { this.state.loadingImage === true ? <View style={styles.imageContainer}>
                                                        <Spinner/>
                                                      </View> : null }
              </Animated.View>
              <Animated.View style={[this.backCardStyle(), styles.cardStyle, styles.flipCardBack]} >
                <ScrollView
                  onTouchStart={(e) => this.props.disableParentScroll(false)}
                  onTouchEnd={(e) => this.props.disableParentScroll(true)}
                >
                  <Text >{book.description}</Text>
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>
            <Animated.View
              style={{ flexDirection: 'row', margin: 20 }}
            >
              <Icon
                raised
                name='check'
                type='font-awesome'
                color={color}
                onPress={() => this.onRead(book.title)} />
              <Icon
                raised
                name='delete'
                type='delete'
                color='#f50'
                onPress={() => this.onDelete(book.title)} />
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
  },
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  cardStyle: {
    height: 400, width: 250,
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    marginTop: 20,
    padding: 20
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
  imageContainer:{//styling for image spinner
     height: 425, 
     width: 250,
     backgroundColor:'#E5EAEF' , 
     position:'absolute', 
     flex:1, 
     flexDirection:'row', 
     alignItems:'center',
     justifyContent:'center'
   }
});

export default connect(
  ({ auth }) => ({ auth }),
  {
    getSavedBooks,
    removeBooks,
    markAsRead
  })(BookCard);
