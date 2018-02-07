import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions, PixelRatio } from 'react-native';
import { Scene, Router, Actions, Stack } from 'react-native-router-flux';
import { loginUser, emailDispatch, passwordDispatch } from '../../actions/authActions';
import { connect } from 'react-redux';
import { Header, Card, CardSection, Button, Input, Spinner } from './';
import {scale, verticalScale, moderateScale } from '../../utils/functions';
import firebase from 'firebase';

const { height, width } = Dimensions.get('window');

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);


class LoginForm extends Component {

  OnButtonPress() {
    const { email, password } = this.props.auth
    this.props.loginUser(email, password)
  }

  onPasswordChange(text) {
    this.props.passwordDispatch(text)
  }

  onEmailChange(text) {
    this.props.emailDispatch(text)
  }

  renderButton() {
    if (this.props.auth.loading === true) {
      return (<Spinner size="small" />)
    }
    return ( <Button onPress={this.OnButtonPress.bind(this)}> Login </Button> )
  }

  render() {
    const { forgotpassowrdStyle, errorViewStyle, errorTextStyle } = styles;
    const { email } = this.props.auth
      return (
                <View style={{ flex: 1 }}>
          {
            this.props.auth.error ?
            <View style={errorViewStyle}>
            <Text style={errorTextStyle}> {this.props.auth.error}</Text>
            </View>
            : null
          }
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
      padding: scale(10),
      fontFamily: 'Avenir-Book'
    }
  }

  export default connect(
    ({ auth }) => ({ auth }),
    { loginUser, emailDispatch, passwordDispatch },
  )(LoginForm)


