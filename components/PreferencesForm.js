import React, { Component } from 'react';
import { View, Text , Picker, ScrollView} from 'react-native';
import { Header, Card, CardSection, Button, Input } from './common';
import { updateTitle, updateAuthor, updateGenre, updatePreferences} from '../redux/actions/preferencesActions';
import { connect } from 'react-redux';
import  PickerGenres from './PickerGenres';
import { Actions } from 'react-native-router-flux';

import   firebase from 'firebase';

class PreferencesForm extends Component {

  onTitleChange(title) {
   console.log('title', title);
   this.props.updateTitle(title);
  }

  onAuthorChange(author) {
   console.log('author', author);
   this.props.updateAuthor(author);
  }

  onGenreChange(genre) {
   console.log('genre', genre);
   this.props.updateGenre(genre);
  }

  handleSubmit(){
            const userId= this.props.auth.userId
            const {title,author}= this.props.preferences;
            this.props.updatePreferences({ title:title, author:author}, userId);
  }

  onEmailChange(email) {
   console.log('email', email);
   this.props.updateQuery(email);
  }

  render() {
    {console.log('props in preferencesform', this.props)}
    const { loggedIn } = this.props.auth;
    return (
       <ScrollView style={styles.container}>
        <Header headerText="Preferences" />
        <Card>
          <CardSection>
             <Input
              placeholder="title"
              label="title"
              onChangeText={this.onTitleChange.bind(this)}
              value={this.props.preferences.title}
            />
          </CardSection>
          <CardSection>
            <Input
              placeholder="author"
              label="author"
              onChangeText={this.onAuthorChange.bind(this)}
              value={this.props.preferences.author}
            />
          </CardSection>
          <CardSection>
            <Button onPress={this.handleSubmit.bind(this)} > update </Button>
          </CardSection>
        </Card>
        <Header headerText="Friends" />
          <Card>
            <Button onPress={() => Actions.friends()} > Find Friends </Button>
          </Card>
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
    ({ preferences, auth }) => ({ preferences: preferences , auth: auth }),
    { updateTitle,
      updateAuthor,
      updateGenre,
      updatePreferences
    },
  )(PreferencesForm)
