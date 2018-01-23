import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Header, Card, CardSection, Button, Input, Spinner } from './common'
import firebase from 'firebase'
import { connect } from 'react-redux'
import {
  forgotPassword,
  emailDispatch,
  passwordDispatch,
  passwordConfirmChange,
  signUpUser
} from '../redux/actions/authActions'
import {dispatchCamera} from '../redux/actions/cameraActions'
import {clearForm} from '../redux/actions/authActions';

import RNF from './Pic'
import { Actions } from 'react-native-router-flux';

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
  componentWillMount(){
    this.props.clearForm();

  }

  OnButtonPress() {


    const { email, password, passwordConfirm } = this.props.auth
    console.log(email, password, 'EMAIL PASS')
    this.props.signUpUser(email, password, passwordConfirm)

  }

  onForgotPassword(email) {
    this.props.forgotPassword(email)
  }

  onEmailChange(text) {
    console.log('hh', this.props.auth, text)
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

  onUploadPress() {
    console.log('ww');
    this.props.dispatchCamera(true)
   // this.setState({shoComponent:true})

  }
  OnRedirect(){

    const { email, password, passwordConfirm } = this.props.auth
    console.log(email, password, 'EMAIL PASS')
    this.props.signUpUser(email, password, passwordConfirm)
    if (this.props.auth.loggedIn)
    Actions.preferencesForm();

  }

  render() {
    console.log(this.props, 'in sign up')

    return (
      <View>

     {/* <CardSection>

            <Button onPress={this.onUploadPress.bind(this)}>Upload Avatar</Button>
            {this.props.cameraRoll.showComponent?
              <RNF id={this.props.auth.userId}/>
         :null }
          </CardSection> */}

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
          </Card>

          <CardSection>

            <Button onPress={(this.OnRedirect.bind(this))}>Next</Button>


          <Button onPress={() => Actions.login()}>login</Button>
          </CardSection>


          <CardSection>
            <Text>{this.props.auth.error}</Text>
          </CardSection>
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

export default connect(({ auth, cameraRoll }) => ({ auth, cameraRoll }), {
  forgotPassword, emailDispatch,
  passwordDispatch,
  passwordConfirmChange,
  signUpUser,
  dispatchCamera,
  clearForm
})(SignUp);
