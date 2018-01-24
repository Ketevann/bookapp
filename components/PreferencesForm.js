import React, { Component } from 'react';
import { View, Text , Picker, ScrollView, TouchableOpacity} from 'react-native';
import { Header, Card, CardSection, Button, Input , RadioInput, RadioButton} from './common';
import {  updatePrefTypeDispatch, keyWordDispatch, updateTitle, updateAuthor, updateGenre, updatePreferences, updateError} from '../redux/actions/preferencesActions';
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

  validate(){//check for empty input fields
     const { preferenceType, keyWord } = this.props.preferences;
     //if author/title or value input are empty, sets true to error in state, else sets false to state
     (preferenceType===null) ? this.props.updateError( 'type', true) : this.props.updateError( 'type', false);
     (keyWord === "" ) ? this.props.updateError( 'value', true): this.props.updateError( 'value', false);
  }

  handleSubmit(){
            const { preferenceType, keyWord, typeErr, valueErr}= this.props.preferences;
            this.validate();//checking for input errors
            //calls api only if there are no input errors
            if  (typeErr===false && valueErr===false && keyWord !== ""  && preferenceType !==null){
              this.props.updatePreferences({ [preferenceType]: keyWord }, this.props.auth.userId);
              //clearing input fields 
              this.props.keyWordDispatch("");
              this.props.updatePrefTypeDispatch(null);
            }
  }

  render() {
    {console.log('props in preferencesform', this.props)}
    const { loggedIn , loading} = this.props.auth;
     const { preferenceType, keyWord,  typeErr, valueErr}= this.props.preferences;
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
              value={keyWord}
            />
           </CardSection>
           <CardSection>
              { valueErr? <Text>Please enter a title or author.</Text>:null }
          </CardSection>
            {/*<CardSection>
            <Button onPress={this.onPreferenceChange.bind(this, "title")} > Title </Button>
          </CardSection>
            <CardSection>
            <Button onPress={this.onPreferenceChange.bind(this, "author")} > Author </Button>
          </CardSection>*/}
           <CardSection>
          <TouchableOpacity onPress={()=>{
            
            }}>
           <RadioInput onChangeSelection={this.onPreferenceChange.bind(this)}  preferenceType={preferenceType} >
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
            </TouchableOpacity>
           </CardSection>
          <CardSection>
            { typeErr? <Text>Please select a title or author.</Text>:null}
            {  this.props.preferences.preferences.length === 0 && typeErr===false && valueErr===false ? <Text>These preferences returned no books.</Text>:null}
           </CardSection>
           <CardSection>
            <Button onPress={this.handleSubmit.bind(this)} > update </Button>
          </CardSection>
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
      updatePreferences,
      updateError
    },
  )(PreferencesForm)
