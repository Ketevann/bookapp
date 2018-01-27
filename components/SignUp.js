import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card, CardSection, Button, Input } from './common';
import { connect } from 'react-redux';
import {
  forgotPassword,
  emailDispatch,
  passwordDispatch,
  passwordConfirmChange,
  signUpUser,
  clearForm
} from '../redux/actions/authActions';

//import RNF from './Pic'
import { Actions } from 'react-native-router-flux';

class SignUp extends Component {

  componentWillMount() {
    this.props.clearForm();
  }

  onForgotPassword(email) {
    this.props.forgotPassword(email);
  }

  onEmailChange(text) {
    this.props.emailDispatch(text);
  }
  onPasswordChange(text) {
    this.props.passwordDispatch(text);
  }

  onPasswordConfirm(text) {
    this.props.passwordConfirmChange(text);
  }

   OnButtonPress() {
    const { email, password, passwordConfirm } = this.props.auth;
    this.props.signUpUser(email, password, passwordConfirm);
  }

  OnRedirect() {
    const { email, password, passwordConfirm } = this.props.auth;
    this.props.signUpUser(email, password, passwordConfirm);
    if (this.props.auth.loggedIn)
      Actions.preferencesForm();
  }

  render() {
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

const styles = {
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
  forgotPassword,
   emailDispatch,
  passwordDispatch,
  passwordConfirmChange,
  signUpUser,
  clearForm
})(SignUp);
