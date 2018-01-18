import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,

  Animated,
  TouchableOpacity
} from 'react-native';
import { getSavedBooks, removeBooks, markAsRead } from '../redux/actions/bookActions';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions'

var { height, width } = Dimensions.get('window')
import { Icon } from 'react-native-elements'

class BookCard extends Component {
  constructor(props) {
    super(props)
    this.state = { index: 0, value: 0 }
  }

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.currentCard = 0
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    })
  }

  frontCardStyle() {
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    })

    const frontAnimatedStyle = {
      transform: [{ rotateY: this.frontInterpolate }]
    }
    return frontAnimatedStyle
  }

  backCardStyle() {
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    })
    const backAnimatedStyle = {
      transform: [{ rotateY: this.backInterpolate }]
    }
    return backAnimatedStyle
  }


  flipCard(ind) {
    console.log(ind, ' index in flipCard', this.value)
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
    console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
    this.props.removeBooks(this.props.auth.userId, title)
  }


  onRead(title) {
    console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
    this.props.markAsRead(this.props.auth.userId, title)
  }


  renderElemets(book) {
    let color;
    console.log('READ', book.read, book)
    if (book.read === true) {
      color = '#f50';
    } else color = 'gray';

    let modifiedLink;
    if (book.image.smallThumbnail) {
      modifiedLink = book.image.smallThumbnail.replace(/zoom=[0-9]/, 'zoom=0')
    }

    return (

      <View
      >
        <Text
          style={{
            fontFamily: 'Helvetica'

          }}

        >{book.title}</Text>
        <TouchableOpacity
          onPress={() => this.flipCard()}>

          <Animated.View

          >

            <Animated.Image
              style={[this.frontCardStyle(), styles.cardStyle]}

              source={{ uri: modifiedLink }}
            />

          </Animated.View>
          <Animated.View
            style={[this.backCardStyle(), styles.cardStyle, styles.flipCardBack]}
          >
            <Text>{book.description}</Text>
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


    )
  }


  render() {
     console.log(this.props)
    // var color = 'gray'
    // {
    //   this.props.book && this.props.book.read === true ?
    //     color = '#f50'
    //     :
    //     color = 'gray'
    // }

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

    height: 400, width: 250, backfaceVisibility: 'hidden',
    alignItems: 'center',
    marginTop: 20,
    padding: 20


  },

  card: {
    backgroundColor: 'white', width: 300, alignItems: 'center', borderRadius: 10, height: 500
  },

  flipCardBack: {
    position: "absolute",
    top: 0,

  },





});

//export default BookJS

export default connect(

  ({ auth, preferences }) => ({ auth: auth, preferences: preferences }),

  {



    getSavedBooks,

    removeBooks,

    markAsRead

  })(BookCard)
