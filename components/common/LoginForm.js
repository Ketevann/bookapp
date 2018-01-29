import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, PixelRatio } from 'react-native'
import { Scene, Router, Actions, Stack } from 'react-native-router-flux';
import { loginUser, emailDispatch, passwordDispatch } from '../../redux/actions/authActions'
import { connect } from 'react-redux'

import { Header, Card, CardSection, Button, Input, Spinner } from './'
import firebase from 'firebase'

const { height, width } = Dimensions.get('window');

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
      fontSize: SCREEN_WIDTH * (14 / SCREEN_WIDTH),
      color: '#4A4A4A',
      marginTop: SCREEN_HEIGHT * (10 / SCREEN_HEIGHT),
      letterSpacing: 0.4,
      marginLeft: SCREEN_WIDTH * (193 / SCREEN_WIDTH),
      paddingBottom: 15
    },
    errorViewStyle: {
      backgroundColor: '#F38D8D',
      height: SCREEN_HEIGHT * (42 / SCREEN_HEIGHT),
      marginTop: SCREEN_HEIGHT * (40 / SCREEN_HEIGHT)
    },
    errorTextStyle: {
     color: '#FFFFFF',
      fontSize: SCREEN_WIDTH * (14 / SCREEN_WIDTH),
      textAlign: 'center',
      padding: 10,
      fontFamily: 'Avenir-Book'

    }
  }

  export default connect(
    ({ auth }) => ({ auth }),
    { loginUser, emailDispatch, passwordDispatch },
  )(LoginForm)


