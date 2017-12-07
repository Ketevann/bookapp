import React, { Component } from 'react';
import { View, Text , Picker} from 'react-native';
import { Header, Card, CardSection, Button, Input } from './common';
import { updatedTitle, updatedAuthor, updatedGenre, updatedPreferencesFireBase } from '../redux/actions/preferencesActions';
import { connect } from 'react-redux';
import   PickerGenres from './PickerGenres';
import   firebase from 'firebase';

class PreferencesForm extends Component {

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

  handleSubmit=()=>{
            const userId= this.props.auth.userId
            const {title,author, genre}= this.props.preferences;
            this.props.updatedPreferencesFireBase({ title:title, author:author, genre:genre}, userId);
  }
 
  render() {
    {console.log('props in preferencesform', this.props)}
    const { loggedIn } = this.props.auth;
    return (
      <View style={styles.container}>
        <Header headerText="Preferences" />
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
            <PickerGenres
              onValueChange={this.onGenreChange.bind(this)}
              value={this.props.preferences.genre}
            /> 
          <CardSection>
            <Button onPress={()=> this.handleSubmit()} > Submit </Button>
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
    ({ preferences, auth }) => ({ preferences: preferences , auth: auth}),
    { updatedTitle, 
      updatedAuthor, 
      updatedGenre,
      updatedPreferencesFireBase
    },
  )(PreferencesForm)
