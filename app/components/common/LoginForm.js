import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, PixelRatio } from 'react-native'
import { Scene, Router, Actions, Stack } from 'react-native-router-flux';
import { loginUser, emailDispatch, passwordDispatch } from '../../actions/authActions'
import { connect } from 'react-redux'

import { Header, Card, CardSection, Button, Input, Spinner } from './'
import firebase from 'firebase'

const { height, width } = Dimensions.get('window');
import {scale, verticalScale, moderateScale } from '../../utils/functions';

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);



class LoginForm extends Component {

  OnButtonPress() {
    const { email, password } = this.props.auth
    console.log(email, password, 'EMAIL PASS')
    this.props.loginUser(email, password)

  }

    onPasswordChange(text) {
      console.log('text')
      this.props.passwordDispatch(text)
    }

    onEmailChange(text) {
      console.log('hh', this.props.auth, text)
      this.props.emailDispatch(text)
    }

    renderButton() {
      console.log('button')
      if (this.props.auth.loading === true) {
        return (<Spinner size="small" />)
      }
      return (
        <Button onPress={this.OnButtonPress.bind(this)}> Login </Button>)
    }

    forgotPassword() {
      var auth = firebase.auth();
      var emailAddress = "user@example.com";

      auth.sendPasswordResetEmail(emailAddress).then(function () {
        // Email sent.
      }).catch(function (error) {
        // An error happened.
      });
    }

    render() {
      { console.log('props in loginform', this.props) }
      const { forgotpassowrdStyle, errorViewStyle, errorTextStyle } = styles;
      return (
        <View
          style={{ flex: 1 }}
        >
        {this.props.auth.error ?
          <View
          style={errorViewStyle}
          >
          <Text
          style={errorTextStyle}
          >{this.props.auth.error}</Text>
          </View>
          : null }

          <Input
            placeholder="Email"
            onChangeText={this.onEmailChange.bind(this)}
            value={this.props.auth.email}
          />
          <Input
            secureTextEntry
            placeholder="Password"
            onChangeText={this.onPasswordChange.bind(this)}
            value={this.props.auth.password}
          />
          <Text
            style={forgotpassowrdStyle}
            onPress={() => Actions.forgotpassowrd()}>
            Forgot password *
            </Text>
          {this.renderButton()}

        </View>

      )
    }
  }

  const styles = {
    passwordStyle: {

    },
    forgotpassowrdStyle: {
      fontFamily: 'Avenir-Book',
      fontSize: scale(12),
      color: '#4A4A4A',
      marginTop: verticalScale(10),
      letterSpacing: 0.4,
      marginLeft: scale(140),
    },
    errorViewStyle: {
      backgroundColor: '#F38D8D',
      height: verticalScale(59),
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

  export default connect(
    ({ auth }) => ({ auth }),
    { loginUser, emailDispatch, passwordDispatch },
  )(LoginForm)


