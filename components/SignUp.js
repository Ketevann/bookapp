import React, { Component } from 'react';
import { View, Text, Dimensions, PixelRatio } from 'react-native';
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
import { scale, verticalScale, moderateScale } from '../functions'
const { height, width } = Dimensions.get('window');

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);


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
    const { textStyle, signUpLinkStyle, errorTextStyle, errorViewStyle } = styles;

    return (
      <View
        style={{ flex: 1, backgroundColor: 'white' }}
      >
        <Text
          style={styles.header}
        >Sign Up</Text>

        <View
          style={{ flexDirection: 'row', justifyContent: 'center', marginTop: scale(8) }}
        >
          <Text
            style={textStyle}
          >
            Already have an account? login
        </Text>
          <Text
            onPress={() => Actions.login()}
            style={[textStyle, signUpLinkStyle]}
          > here</Text>
        </View>
        {this.props.auth.error ?

          <View
            style={errorViewStyle}
          >
            <Text
              style={errorTextStyle}
            >{this.props.auth.error}
            </Text>
          </View>
          : null}
        <Input
          placeholder="Email"
          value={this.props.auth.email}
          onChangeText={this.onEmailChange.bind(this)}
        />

        <Input
          secureTextEntry
          placeholder="password"
          onChangeText={this.onPasswordChange.bind(this)}
          value={this.props.auth.password}
        />

        <Input
          secureTextEntry
          placeholder="confirm password"
          onChangeText={this.onPasswordConfirm.bind(this)}
          value={this.props.auth.passwordConfirm}
        />

        <Button onPress={this.OnRedirect.bind(this)}>Sign Up</Button>

      </View>
    )
  }
}

const styles = {
  header: {
    textAlign: 'center',
    fontSize: scale(20),
    fontFamily: 'Avenir-Book',
    marginTop: verticalScale(40)
  },

  textStyle: {
    textAlign: 'center',
    fontFamily: 'Avenir-Book',
    color: '#9B9B9B',
    fontSize: scale(14),
    lineHeight: scale(15)
  },
  signUpLinkStyle: {
    textDecorationLine: 'underline',
    color: 'navy'
  },
  errorViewStyle: {
    backgroundColor: '#F38D8D',
    height: verticalScale(42),
    marginTop: verticalScale(25)
  },
  errorTextStyle: {
    color: '#FFFFFF',
    fontSize: scale(14),
    textAlign: 'center',
    padding: 10,
    fontFamily: 'Avenir-Book'

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
