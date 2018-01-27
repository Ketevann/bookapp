import React, { Component } from 'react';
import { View, Text, Picker, ScrollView } from 'react-native';
import { Header, Card, CardSection, Button, Input, Spinner } from './common';
import { connect } from 'react-redux';
import firebase from 'firebase';
import {
  getSavedBooks
} from '../redux/actions/bookActions';
import { Avatar } from 'react-native-elements'
import BookCard from './BookCard'

class Profile extends Component {
  constructor(props) {
    super(props)


    this.state = { scrollActive:true }
  }
  disableParentScroll(bool){
    this.setState({ scrollActive:bool } )
  }

  onDelete(title) {
    console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****da', title )
    var arr = this.props.book.savedBooks.filter(eachbook =>{
      if (title !== eachbook.title) {

        console.log(title, eachbook.title)
        return eachbook;}
    })
    this.displayBooks(arr)
   // this.props.removeBooks(this.props.auth.userId, title)
  }
  displayBooks(arr) {
   // console.log('run this function', this.props.book.savedBooks)
    const { savedBooks, loading } = this.props.book;
    //console.log(loading, 'loading in display');

      return arr.map((book, index) => {
        let modifiedLink;
        if (book.image.smallThumbnail) {
          book.image.smallThumbnail = book.image.smallThumbnail.replace(/zoom=[0-9]/, 'zoom=0')
        }


        return (
          <BookCard
            onDelete={this.onDelete.bind(this)}
            key={index}
            books={book}
            index={index}
            disableParentScroll={this.disableParentScroll.bind(this)}
            loading={loading}
          />

        )
      });



  }

  render() {
  //  { console.log(this.props, ' jessica') }
    const { loggedIn } = this.props.auth;
    return (
      <ScrollView style={styles.container} scrollEnabled={this.state.scrollActive}>
        <View>
          <Avatar
            containerStyle={{ position: 'absolute', right: 0 }}
            large
            rounded
            source={{ uri: `data:image/jpeg;base64,${this.props.auth.image}` }}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
        </View>
        <View
          style={{ alignItems: 'center' }}
        >
          {
            this.props.book.savedBooks?
            this.displayBooks(this.props.book.savedBooks)

        :   <Spinner size="large" />
          }
        </View>
      </ScrollView>
    )
  }
}

styles = {
  container: {
    flex: 1,
    paddingHorizontal: 10,
  }
}

export default connect(
  ({ auth, book }) => ({ auth: auth, book: book }),
  {
    getSavedBooks,
  },
)(Profile)
