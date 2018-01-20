import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import LoginForm  from './common/LoginForm'
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { connect } from 'react-redux'
import { clearForm } from '../redux/actions/authActions';
import { Actions } from 'react-native-router-flux';


class Login extends Component {

  componentWillMount() {
    this.props.clearForm();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.loginDispatch()
      }
      else this.props.loginDispatchFalse()
    })

  }

  renderContent() {
    console.log(this.props.auth.loggedIn, 'logged in')
    const { loggedIn } = this.props.auth
    console.log(loggedIn, '***');
    if (loggedIn) {

        console.log(loggedIn, 'true');
        return (
          <Button onPress={() =>
            firebase.auth().signOut()}>
            Log Out</Button>)
      }
      else if (loggedIn === false){
        return <LoginForm />
      }

      else {
        return <Spinner size='large' />
      }

    }



    render() {
      { console.log('props', this.props, this.state) }
      return (
        <View style={{flex:1}}>
          <Header headerText="Authentication" />
          {this.renderContent()}
          <Text>Already a User? </Text>
          <Text onPress={() => Actions.signup()}>Sign Up</Text>
        </View>
      );
    }
  }

  export default connect(({ auth }) => ({ auth: auth }),
    { loginDispatch, loginDispatchFalse, clearForm },
  )(Login)
