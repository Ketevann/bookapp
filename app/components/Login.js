import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import LoginForm from './common/LoginForm';
import { loginDispatch, loginDispatchFalse, clearForm } from '../actions/authActions';
import { scale, verticalScale, moderateScale } from '../utils/functions'


class Login extends Component {
  componentWillMount() {
    this.props.clearForm();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.loginDispatch();
      } else this.props.loginDispatchFalse();
    });
  }

  renderContent() {
    return <LoginForm />
  }

  render() {
    const { textStyle, signUpLinkStyle } = styles;
    return (
      <View style={{ flex: 1, backgroundColor: 'white'}}>
        <Text style={styles.header} >Log In</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: verticalScale(8)}} >
          <Text style={textStyle} >
            Don't have an account? sign up
          </Text>
          <Text onPress={() => Actions.signup()} style={[textStyle, signUpLinkStyle]}> here</Text>
        </View>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = {
  header: {
   textAlign: 'center',
    fontSize: verticalScale(20),
    fontFamily: 'Avenir-Book',
    marginTop: verticalScale(20)
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: 'Avenir-Book',
    color: '#9B9B9B',
    fontSize: verticalScale(14),
    lineHeight: verticalScale(15)
  },
  signUpLinkStyle:{
    textDecorationLine: 'underline',
    color: 'navy'
  }
}

export default connect(({ auth }) => ({ auth }),
  { loginDispatch, loginDispatchFalse, clearForm },
)(Login);
