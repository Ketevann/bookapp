import React, { Component } from 'react';
import { View, Text , Picker, ScrollView} from 'react-native';
import { Header, Card, CardSection, Button, Input , RadioInput, RadioButton} from './common';
import {  updatePrefTypeDispatch, keyWordDispatch, updateTitle, updateAuthor, updateGenre, updatePreferences} from '../redux/actions/preferencesActions';
import { connect } from 'react-redux';
import  PickerGenres from './PickerGenres';
import { Actions } from 'react-native-router-flux';

import   firebase from 'firebase';

class PreferencesForm extends Component {

  // onTitleChange(title) {
  //  console.log('title', title);
  //  this.props.updateTitle(title);
  // }

  // onAuthorChange(author) {
  //  console.log('author', author);
  //  this.props.updateAuthor(author);
  // }

  // onGenreChange(genre) {
  //  console.log('genre', genre);
  //  this.props.updateGenre(genre);
  // }

  onChangeKeyWord(keyWord) {
   console.log('keyWord', keyWord);
   this.props.keyWordDispatch(keyWord);
  }


  onPreferenceChange(preference){
    this.props.updatePrefTypeDispatch(preference);
  }

  handleSubmit(){
            const userId= this.props.auth.userId
            // const {title,author}= this.props.preferences;
            // this.props.updatePreferences({ title, author}, userId);
            const { preferenceType, keyWord}= this.props.preferences;
            this.props.updatePreferences({ [preferenceType]: keyWord }, userId);
  }

  render() {
    {console.log('props in preferencesform', this.props)}
    const { loggedIn } = this.props.auth;
    return (
      //  <ScrollView style={styles.container}>
      //   <Header headerText="Preferences" />
      //   <Card>
      //     <CardSection>
      //        <Input
      //         placeholder="title"
      //         label="title"
      //         onChangeText={this.onTitleChange.bind(this)}
      //         value={this.props.preferences.title}
      //       />
      //     </CardSection>
      //     <CardSection>
      //       <Input
      //         placeholder="author"
      //         label="author"
      //         onChangeText={this.onAuthorChange.bind(this)}
      //         value={this.props.preferences.author}
      //       />
      //     </CardSection>
      //     <CardSection>
      //       <Button onPress={this.handleSubmit.bind(this)} > update </Button>
      //     </CardSection>
      //   </Card>
      //   <Header headerText="Friends" />
      //     <Card>
      //       <Button onPress={() => Actions.friends()} > Find Friends </Button>
      //     </Card>
      // </ScrollView>
         <ScrollView style={styles.container}>
        <Header headerText="Preferences" />
        <Card>
          <CardSection>
             <Input
              placeholder="enter keyword"
              onChangeText={this.onChangeKeyWord.bind(this)}
              value={this.props.preferences.keyWord}
            />
          </CardSection>
            {/*<CardSection>
            <Button onPress={this.onPreferenceChange.bind(this, "title")} > Title </Button>
          </CardSection>
            <CardSection>
            <Button onPress={this.onPreferenceChange.bind(this, "author")} > Author </Button>
          </CardSection>*/}
           <CardSection>
           <RadioInput onChangeSelection={this.onPreferenceChange.bind(this)}>
                <RadioButton  
                    label= {'title'}
                    size={ 12}
                    color={ '#007aff'}
                />
                <RadioButton  
                    label= {'author'}
                    size={ 12}
                    color={ '#007aff'}
                />
            </RadioInput>
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
    { 
      updatePrefTypeDispatch,
      keyWordDispatch,
      updateTitle,
      updateAuthor,
      updateGenre,
      updatePreferences
    },
  )(PreferencesForm)
