import React, { Component } from 'react';
import { View, Text, Picker, ScrollView } from 'react-native';
import { Header, Card, CardSection, Button, Input } from './common';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { getSavedBooks
 } from '../redux/actions/bookActions';
import {Avatar} from 'react-native-elements'
import SavedBooks from './SavedBooks'

class Profile extends Component {



  displayBooks() {
    if (this.props.book.savedBooks) {
      return <SavedBooks renderBooks={this.props.book.savedBooks} user={this.props.book.user} />
    }
    else return null
  }

  render() {
    { console.log(this.props, ' jessica') }
    const { loggedIn } = this.props.auth;
    return (
      <ScrollView style={styles.container}>
  <View>
  <Avatar
  containerStyle={{position: 'absolute', right: 0}}
  large
  rounded
  source={{uri: `data:image/jpeg;base64,${this.props.auth.image}` }}
  onPress={() => console.log("Works!")}
  activeOpacity={0.7}
/>
</View>
  <View>
        {this.displayBooks()}

</View>
      </ScrollView>
    )
  }
}

styles = {
  container: {
    flex: 1,
    paddingHorizontal: 10
  }
}

export default connect(
  ({ auth,  book }) => ({ auth: auth,  book: book }),
  {
    getSavedBooks,
  },
)(Profile)
