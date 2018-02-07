import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card, CardSection, Button, Input } from './common';
import { connect } from 'react-redux';
import { forgotPassword, emailDispatch } from '../actions/authActions';
import { scale, verticalScale } from '../utils/functions'

class ForgotPassword extends Component {

  onForgotPassword(email) {
    this.props.forgotPassword(this.props.auth.email);
  }

  onEmailChange(text) {
    this.props.emailDispatch(text);
  }

  render() {
    const { viewStyle, errorViewStyle, errorTextStyle, textStyle } = styles;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }} >
        <Text style={styles.header}>
          Forgot your Password ?
        </Text>
        <View style={{ paddingBottom: verticalScale(10), marginTop: scale(10) }}>
          <Text style={textStyle}>
            Enter your email and we will send
          </Text>
          <Text style={textStyle}>
            you instructions...
          </Text>
        </View>
        {
          this.props.auth.forgotError ?
          <View style={errorViewStyle}>
            <Text style={errorTextStyle}>
              {this.props.auth.forgotError}
            </Text>
          </View>
          : null
        }

        {this.props.auth.sentMessage ?
          <View style={errorViewStyle}>
            <Text style={errorTextStyle}>
              {this.props.auth.sentMessage}
            </Text>
          </View>
          : null
        }
        <Input
          placeholder="Email"
          value={this.props.auth.email}
          onChangeText={this.onEmailChange.bind(this)}
        />
        <Button onPress={this.onForgotPassword.bind(this)}>Submit</Button>
      </View>
    )
  }
}

const styles = {
  viewStyle: {
    flex: 1
  },
  header: {
    textAlign: 'center',
    fontSize: scale(17),
    fontFamily: 'Avenir-Book',
    marginTop: scale(20)
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: 'Avenir-Book',
    color: '#9B9B9B',
    fontSize: scale(14),
    lineHeight: scale(15)
  },
  errorViewStyle: {
    backgroundColor: '#F38D8D',
    height: verticalScale(50),
    marginTop: verticalScale(25)
  },
  errorTextStyle: {
    color: '#FFFFFF',
    fontSize: scale(14),
    textAlign: 'center',
    padding: scale(10),
    fontFamily: 'Avenir-Book'
  }
};

export default connect(({ auth }) => ({ auth }), { forgotPassword, emailDispatch })(ForgotPassword);
