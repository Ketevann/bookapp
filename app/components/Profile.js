import React, { Component } from 'react';
import { View, ScrollView, Text, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from './common';
import {
  getSavedBooks, searchSavedBooks, clearSearchedBooks, reRenderSearch, clearSearch
} from '../actions/bookActions';
import { scale, verticalScale, moderateScale } from '../utils/functions'
import BookCard from './BookCard';
import SearchComponent from './Search'

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

  handleSubmit() {
    const { searchbooks, placeholder } = this.props.book
    const { userId } = this.props.auth.userId;
    this.props.searchSavedBooks(searchbooks, placeholder, this.props.auth.userId); //checks the user's book for the query keyword
  }

  updateFilteredBooks(title, updateType) {//sending the searched books array, a title and what is to be done to that book (updateType = read || delete )
    this.props.reRenderSearch(this.props.book.searchQuery, title, updateType)
  }

  displayBooks(books, filter = false) {
    const { loading } = this.props.book;
    return books.map((book, index) => {
      return (
        <BookCard
          onDelete={this.onDelete.bind(this)}
          key={index}
          books={book}
          index={index}
          disableParentScroll={this.disableParentScroll.bind(this)}
          updateFilteredBooks={filter ? this.updateFilteredBooks.bind(this) : null}//if filter is true, set filterUpdate function to props (we use this to update read/delete searched books display)
        />
      )
    });
  }

  displayPage() {// handles rendering of books
    const { savedBooks, searchQuery, loading } = this.props.book;
    if (searchQuery && !loading) {
      return (
              searchQuery.length===0 ?
              <View style={styles.errContainer}>
                <Text style={[ {marginTop: verticalScale(10)}, styles.errorTextStyle ]}>Your search returned no results</Text>
                <Image
                  style={styles.image}
                  source={{ uri: 'https://vignette.wikia.nocookie.net/youtubepoop/images/3/37/Ice_bear.png/revision/latest?cb=20160108184102' }}
                />
              </View> :
              this.displayBooks(searchQuery, true)
            ); //display searched books, filter paratmeter is true
    } else if (savedBooks && !loading) {
      return (
        <View style={styles.booksContainer}>
         { savedBooks.length===0 ?


            <Text style={[ {marginTop: verticalScale(10)}, styles.errorTextStyle ]}>Time to save some books!  </Text>
         :this.displayBooks(savedBooks)}
        </View>//display saved books, no filter bool
      )
    } return <Spinner size="large" />; //display spinner in when switching between saved and searched
  }

  render() {
    const { userId } = this.props.auth.userId;
    return (
      <View >
        <SearchComponent handleSubmit={this.handleSubmit.bind(this)} userId={userId} onDelete={this.props.clearSearch} clearBooks={this.props.clearSearchedBooks} />
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 , paddingBottom: verticalScale(150) }} scrollEnabled={this.state.scrollActive}>
          {this.displayPage()}
        </ScrollView>
       </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: 'white',
    paddingBottom: verticalScale(300)
  },
    errorTextStyle: {
    marginTop: verticalScale(5),
    color: '#f50',
    fontSize: scale(17),
    textAlign: 'center',
    //padding: 10,
    fontFamily: 'Avenir-Book'
  },
  image:{
    flex: 1,
    opacity: 0.5,
    width: scale(300),
    height: verticalScale(300),
    resizeMode: 'contain'
  },
  errContainer:{
    flex:1,
    padding: scale(20),
    flexDirection:'column-reverse',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default connect(
  ({ auth, book }) => ({ auth, book }),
  {
    getSavedBooks,
    searchSavedBooks,
    clearSearchedBooks,
    reRenderSearch,
    clearSearch
  },
)(Profile)
