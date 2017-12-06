import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Header, Card, CardSection, Button, Input, Spinner } from './common'
import firebase from 'firebase'
import {connect} from 'react-redux'
import {forgotPassword, emailDispatch, passwordDispatch, passwordConfirmChange, signUpUser} from '../redux/actions/authActions'
class SignUp extends Component {


  //   forgotPassword(){
  //  var auth = firebase.auth();
  // var emailAddress = "user@example.com";

  // auth.sendPasswordResetEmail(emailAddress).then(function() {
  //   // Email sent.
  // }).catch(function(error) {
  //   // An error happened.
  // });
  //   }


  OnButtonPress() {


    const { email, password, passwordConfirm } = this.props.auth
    console.log(email, password, 'EMAIL PASS')
    this.props.signUpUser(email, password, passwordConfirm)

  }

onForgotPassword(email) {
  this.props.forgotPassword(email)
}

 onEmailChange(text) {
   console.log('hh',this.props.auth, text)
  this.props.emailDispatch(text)
  }
  onPasswordChange(text) {
    console.log('text')
  this.props.passwordDispatch(text)
}

  onPasswordConfirm(text) {
    console.log('text')
  this.props.passwordConfirmChange(text)
}


  render() {
    console.log(this.props, 'in sign up')
    return (
      <View>
        <Card>
          <CardSection>
            <Input
              placeholder="user!!!!@gmail.com"
              label="Email"
              value={this.props.auth.email}
              onChangeText={this.onEmailChange.bind(this)}
            />
          </CardSection>
          <CardSection>
            <Input
              secureTextEntry
              placeholder="password"
              label="Password"
              onChangeText={this.onPasswordChange.bind(this)}
              value={this.props.auth.password}
            />
          </CardSection>
          <CardSection>
            <Input
              secureTextEntry
              placeholder="confirm password"
              label="Password"
              onChangeText={this.onPasswordConfirm.bind(this)}
              value={this.props.auth.passwordConfirm}
            />
          </CardSection>

          <CardSection>
            <Button onPress={this.OnButtonPress.bind(this)}>Next</Button>
          </CardSection>
          <CardSection>
            <Text>{this.props.auth.error}</Text>
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

export default connect(({ auth }) => ({auth}), {forgotPassword, emailDispatch,
passwordDispatch,
passwordConfirmChange,
signUpUser})(SignUp);