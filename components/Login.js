import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import LoginForm  from './common/LoginForm'
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { connect } from 'react-redux'

class Login extends Component {

  // componentWillMount() {

  //   firebase.auth().onAuthStateChanged((user) => {
  //     console.log((this.props, ' in authfirebase', user))
  //     if (user) {
  //       this.props.loginDispatch(user.uid)
  //     }
  //     else this.props.loginDispatchFalse()
  //   })
  // }

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
        <View>
          <Header headerText="Authentication" />
          {this.renderContent()}
        </View>
      );
    }
  }

  export default connect(
    ({ auth }) => ({ auth: auth }),
    { loginDispatch, loginDispatchFalse },
  )(Login)
