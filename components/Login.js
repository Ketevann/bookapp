import React, { Component } from 'react';
import { Text, View, Dimensions, PixelRatio } from 'react-native';
const { height, width } = Dimensions.get('window');

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import LoginForm from './common/LoginForm';
import { loginDispatch, loginDispatchFalse, clearForm } from '../redux/actions/authActions';
import { scale, verticalScale, moderateScale } from '../functions'

let SCREEN_WIDTH = PixelRatio.getPixelSizeForLayoutSize(width);
let SCREEN_HEIGHT = PixelRatio.getPixelSizeForLayoutSize(height);



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
    const { loggedIn } = this.props.auth;

    // if (loggedIn) {
    //   return (
    //     <Button
    //       onPress={() =>
    //         firebase.auth().signOut()}>;
    //       Log Out</Button>)
    // } else if (loggedIn === false) {
      return <LoginForm />
    // } return <Spinner size='large' />;
  }


  render() {
    const { textStyle, signUpLinkStyle } = styles;
    console.log(SCREEN_HEIGHT, SCREEN_WIDTH)
    return (
      <View style={{ flex: 1, backgroundColor: 'white'}}>
        <Text
        style={styles.header}
        >Log In</Text>
        <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: verticalScale(8)}}
        >
        <Text
        style={textStyle}
        >
          Don't have an account? sign up
        </Text>
        <Text
        onPress={() => Actions.signup()}
        style={[textStyle, signUpLinkStyle]}
        > here</Text>
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
