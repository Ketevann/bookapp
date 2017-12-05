import React, { Component } from 'react'
import { View, Text , Picker} from 'react-native'
import { connect } from 'react-redux'
import PickerGenres from './PickerGenres'
import { Header, Card, CardSection, Button, Input, Spinner } from './'
import firebase from 'firebase'

import { updatedTitle, updatedAuthor, updatedGenre, updatedPreferencesFireBase } from '../../redux/actions/preferencesActions'
import { loginDispatch, loginDispatchFalse } from '../../redux/actions/authActions'


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

  componentWillMount(){
      console.log('mounted');
      firebase.auth().onAuthStateChanged((user) => {
      console.log((this.props, ' in authfirebase', user))
      if (user) {
        this.props.loginDispatch(user.uid)
      }
      else this.props.loginDispatchFalse()
    })
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

  handleSubmit=(userUID)=>{
    alert("submit",userUID );
    const {title,author, genre}= this.props.preferences;
    let preferences={};
        preferences.title=title;
        preferences.author=author;
        preferences.genre=genre;
        this.props.updatedPreferencesFireBase(preferences, userUID);
        }

  

  render() {
    {console.log('props in preferencesform', this.props)}
    const { loggedIn , userUID } = this.props.auth;
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
          <CardSection>
            <PickerGenres
            items={genres}
            onValueChange={this.onGenreChange.bind(this)}
            value={this.props.preferences.genre}
          /> 
          <Button onPress={()=> this.handleSubmit(userUID)} >
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
    ({ preferences, auth }) => ({ preferences: preferences , auth: auth}),
    { updatedTitle, 
      updatedAuthor, 
      updatedGenre,
      updatedPreferencesFireBase,
      loginDispatch, 
      loginDispatchFalse
    },
  )(PreferencesForm)