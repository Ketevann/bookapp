import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Button } from './common';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Card, Icon } from 'react-native-elements'
import { clearPreferences } from '../redux/actions/preferencesActions';
//import Dimensions from 'Dimensions'
import Deck from './Deck';
var { height, width } = Dimensions.get('window');

class Book extends Component {

  replaceZoomDigit(link) {
    console.log(link, 'link', link.replace(/zoom=[0-9]/, 'zoom=0'))
    return link.replace(/zoom=[0-9]/, 'zoom=0')

  }
  onEnd(){
    const userId = this.props.auth.userId;
    this.props.clearPreferences(userId)
  }

  render() {
  // const { preferences } = this.props.preferences;

    // const { imageLinks, title } = this.props.book,
    const   { loggedIn } = this.props.auth
    const   { book } = this.props
     console.log(this.props, ' in BOOK', book)
     let modifiedLink;

    return (


        <Deck
          data={this.props.book}
          onSwipeRight={this.props.onSaveBook}//passing save/delete suggestions function as props
          onSwipeLeft={this.props.onRemoveBook}
          onEnd={ this.onEnd.bind(this) }
        />


    );
  }
}





 //      {

    //       this.props.book && this.props.book.map((item, index) => {
    //         console.log(item, 'item', )
    //         if (item.imageLinks.smallThumbnail) {
    //   console.log(item.imageLinks.smallThumbnail, ' links')
    //   modifiedLink = this.replaceZoomDigit(item.imageLinks.smallThumbnail)
    // }
    //         return (
    //           <View
    //           key={index}
    //           >
    //             <Text style={styles.title} >{item.title}</Text>
    //             <Image

    //               source={{ uri: modifiedLink }} style={styles.image} />
    //             {loggedIn ?
    //               <Icon
    //                 raised
    //                 name='heart'
    //                 type='font-awesome'
    //                 color='#f50'
    //                 size={44}
    //                 onPress={() => this.props.onSaveBook(book)} />
    //               : <Text>sign in to save</Text>}


    //           </View>
    //         )
    //       })


    //     }


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8ff',

    display: 'flex',
  },
  image: {
    flex: 1,
    width: width,
    height: height
  }
});


export default connect(({ auth ,preferences }) => ({ auth: auth , preferences: preferences}), { clearPreferences})(Book)

