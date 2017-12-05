import React, { Component } from 'react'
import { View, Text , Picker} from 'react-native'
import { connect } from 'react-redux'
import PickerGenres from './PickerGenres'
import { Header, Card, CardSection, Button, Input, Spinner } from './'
import firebase from 'firebase'

import { updatedTitle, updatedAuthor, updatedGenre } from '../../redux/actions/preferencesActions'


const genres = [
  {
    label: 'Adventure',
    value: 'Adventure',
  },
  {
    label: 'Drama',
    value: 'Drama',
  },
  {
    label: 'Fiction',
    value: 'Fiction',
  },
  {
    label: 'Biography',
    value: 'Biography',
  },
  {
    label: 'Science',
    value: 'Science',
  },
  {
    label: 'Technology',
    value: 'Technology',
  },
  {
    label: 'History',
    value: 'History',
  },
  {
    label: 'Fantasy',
    value: 'Fantasy',
  },
];

class PreferencesForm extends Component {
   constructor(props) {
    super(props);
    // this.state = {
    //   author:'',
    //   genre: '',
    // };
  }
  onTitleChange(title) {
   console.log('title', title);
   this.props.updatedTitle(title);
  }

  onAuthorChange(author) {
   console.log('author', author);
   this.props.updatedAuthor(author);
  }

  onGenreChange(genre) {
   console.log('genre', genre);
   this.props.updatedGenre(genre);
  }

  render() {
    {console.log('props in preferencesform', this.props)}
    return (
      <View style={styles.container}>
        <Card>
          <CardSection>
             <Input
              secureTextEntry
              placeholder="title"
              label="title"
              onChangeText={this.onTitleChange.bind(this)}
              value={this.props.preferences.title}
            />
          </CardSection>
          <CardSection>
            <Input
              secureTextEntry
              placeholder="author"
              label="author"
              onChangeText={this.onAuthorChange.bind(this)}
              value={this.props.preferences.author}
            />
          </CardSection>
          <CardSection>
            <PickerGenres
            items={genres}
            onValueChange={this.onGenreChange.bind(this)}
            value={this.props.preferences.genre}
          /> 
          <Button onPress={() =>
            this.props.updatedTitle("the stranger")} >
           Submit
          </Button>
          </CardSection>
        </Card>
      </View>
    )
  }
}

styles = {
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 50,
  }
}

export default connect(
    ({ preferences }) => ({ preferences: preferences }),
    { updatedTitle, updatedAuthor, updatedGenre },
  )(PreferencesForm)