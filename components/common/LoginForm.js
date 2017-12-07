import React, { Component } from 'react'
import { View, Text } from 'react-native'
import {Scene, Router, Actions, Stack} from 'react-native-router-flux';
import {loginUser, emailDispatch, passwordDispatch} from '../../redux/actions/authActions'
import { connect } from 'react-redux'

import { Header, Card, CardSection, Button, Input, Spinner } from './'
import firebase from 'firebase'


class LoginForm extends Component {

  OnButtonPress() {
    const { email, password } = this.props.auth
    console.log(email, password, 'EMAIL PASS')
    this.props.loginUser(email, password)
   // this.setState({ error: '', loading: true })

    // firebase.auth().signInWithEmailAndPassword(email, password)
    //   .then(this.onLoginSuccess.bind(this))
    //   .catch(() => {
    //     firebase.auth().createUserWithEmailAndPassword(email, password)
    //       .then(
    //         this.onLoginSuccess.bind(this))
    //       .catch(
    //         this.onLoginFail.bind(this))

    //   });
  }

  // onLoginFail() {
  //   this.setState({ error: 'Authentication Failed', loading: false })

  // }

  // onLoginSuccess() {
  //   this.setState({ email: '', password: '', error: '', loading: false })

  // }


  onPasswordChange(text) {
    console.log('text')
  this.props.passwordDispatch(text)
}

 onEmailChange(text) {
   console.log('hh',this.props.auth, text)
  this.props.emailDispatch(text)
  }

  renderButton() {
    console.log('button')
    if (this.props.auth.loading === true) {
      return (<Spinner size="small" />)
    }
    return (<Button onPress={this.OnButtonPress.bind(this)}> Login </Button>)
  }

  forgotPassword(){
    var auth = firebase.auth();
var emailAddress = "user@example.com";

auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});
  }

  render() {
    {console.log('props in loginform', this.props)}
    return (
      <View>

        <Card>
          <CardSection>
            <Input
              placeholder="user@gmail.com"
              label="Email"
              onChangeText={this.onEmailChange.bind(this)}
              value={this.props.auth.email}
            />
          </CardSection>
          <CardSection>
            <Input
              secureTextEntry
              placeholder="123"
              label="Password"
              onChangeText={this.onPasswordChange.bind(this)}
              value={this.props.auth.password}
            />
          </CardSection>
          <CardSection>
            <Text>{this.props.auth.error}</Text>
          </CardSection>
          <CardSection>

            {this.renderButton()}

          </CardSection>
          <CardSection>
          <Button onPress={()=> Actions.forgotpassowrd()}>
           Forgot password
            </Button>
          </CardSection>

        </Card>
      </View>

    )
  }
}

styles = {
  passwordStyle: {
    marginTop: 20,
    marginLeft: 50,
    width: 250,
    padding: 20,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'red'
  },
  nameStyle: {
    marginTop: 20,
    marginLeft: 50,
    width: 250,
    padding: 20,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'red'
  }
}

export default connect(
  ({ auth }) => ({ auth }),
  {loginUser, emailDispatch, passwordDispatch},
)(LoginForm)


