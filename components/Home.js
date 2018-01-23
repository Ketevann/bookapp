import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Header, Card, CardSection, Button, Spinner } from './common'
import { getSuggestions, getDefualt, updateDefaultSuggestions } from '../redux/actions/preferencesActions';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Dimensions from 'Dimensions'
var { height, width } = Dimensions.get('window')
import firebase from 'firebase';
import Book from './Book';
import Search from './Search'
class Home extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.loginDispatch(user.uid);
        this.props.getSuggestions(user.uid);//if logged in, then check for saved preferences, loads either preferred books or defualt(if there are no preferences) to state
        //this.props.updateDefaultSuggestions();//updating defualt books branch
      }
      else {
        this.props.loginDispatchFalse()
        this.props.getDefualt() //if not logged in, then loads defualt books to state
      }
    })
  }

  render() {
    const { loggedIn } = this.props.auth
    { console.log(this.props, "preferences") }
    const { preferences, loading } = this.props.preferences;
    const { similarbooks } = this.props.book;

    return (

      <View style={{ flex: 1 }}>

        <Search />

        {this.props.book && similarbooks ?
          <Book data={similarbooks} loading={loading} />
          :
          <Card>
            <Book data={preferences} loading={loading} />
            {loggedIn ? <CardSection><Button onPress={() => Actions.preferencesForm()}> Preferences </Button></CardSection> : null}
            <CardSection>
              {loggedIn ? <Button onPress={() => firebase.auth().signOut()}>Log Out</Button> : <Button onPress={() => Actions.login()}> Sign in </Button>}
            </CardSection>
          </Card>
        }
      </View>


    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 12,
    height: 20
  },
});

export default connect(

  ({ book, auth, preferences }) => ({ book: book, auth: auth, preferences: preferences }),
  {
    loginDispatch, loginDispatchFalse,
    getDefualt,
    getSuggestions,
    updateDefaultSuggestions

  })(Home)
