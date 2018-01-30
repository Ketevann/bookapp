import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import {
  getSavedBooks, searchSavedBooks, clearSearchedBooks
} from '../redux/actions/bookActions';
import BookCard from './BookCard';
import Search from './Search'

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

  handleSubmit(){
    const {searchbooks, placeholder} = this.props.book
    const {userId} = this.props.auth.userId;
    this.props.searchSavedBooks(searchbooks, placeholder, this.props.auth.userId); //checks the user's book for the query keyword
  }

  displayBooks(arr) {
    const { loading } = this.props.book;
    //console.log(loading, 'loading in display');
    return arr.map((book, index) => {
      return (
        <BookCard
          onDelete={this.onDelete.bind(this)}
          key={index}
          books={book}
          index={index}
          disableParentScroll={this.disableParentScroll.bind(this)}
        />
      )
    });
  }

  displayPage(){// handles rendering of books 
    const { savedBooks, searchQuery, loading } = this.props.book;
    if ( searchQuery  && !loading){                             //display searched books 
      return this.displayBooks( searchQuery );     
    }else if (savedBooks  && !loading ){             //display saved books
      return  (
                <View style={ styles.booksContainer }>
                  { this.displayBooks( savedBooks ) }
                </View>
              )
    } return  <Spinner size="large" />;              //display spinner in between
  }

  render() {
    const {userId} = this.props.auth.userId;
    return (
      <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}} scrollEnabled={this.state.scrollActive}>
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
        <Search handleSubmit={this.handleSubmit.bind(this)} userId={ userId } clearBooks={ this.props.clearSearchedBooks /* clears searched books results */ }/>
        {this.displayPage()}
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  booksContainer:{
    alignItems: 'center', flex:1
  }
};

export default connect(
  ({ auth, book }) => ({ auth, book }),
  {
    getSavedBooks,
    searchSavedBooks,
    clearSearchedBooks
  },
)(Profile)
