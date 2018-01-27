import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import {
  getSavedBooks
} from '../redux/actions/bookActions';
import BookCard from './BookCard';

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = { scrollActive: true }
  }
  disableParentScroll(bool) {
    this.setState({ scrollActive: bool })
  }

  onDelete(title) {
    var arr = this.props.book.savedBooks.filter(eachbook => {
      if (title !== eachbook.title) {
        return eachbook;
      }
    })
    this.displayBooks(arr)
  }
  displayBooks(arr) {
    const { loading } = this.props.book;
    return arr.map((book, index) => {
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
    return (
      <ScrollView style={styles.container} scrollEnabled={this.state.scrollActive}>
        {/*<View>
          <Avatar
            containerStyle={{ position: 'absolute', right: 0 }}
            large
            rounded
            source={{ uri: `data:image/jpeg;base64,${this.props.auth.image}` }}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
        </View>*/}
        <View
          style={{ alignItems: 'center' }}
        >
          {
            this.props.book.savedBooks ?
              this.displayBooks(this.props.book.savedBooks)

              : <Spinner size="large" />
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 10,
  }
};

export default connect(
  ({ auth, book }) => ({ auth, book }),
  {
    getSavedBooks,
  },
)(Profile)
