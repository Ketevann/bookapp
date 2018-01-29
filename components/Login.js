import React, { Component } from 'react';
import { Text, View, Dimensions, PixelRatio } from 'react-native';
const { height, width } = Dimensions.get('window');

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import LoginForm from './common/LoginForm';
import { loginDispatch, loginDispatchFalse, clearForm } from '../redux/actions/authActions';

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
    if (loggedIn) {
      return (
        <Button
          onPress={() =>
            firebase.auth().signOut()}>;
          Log Out</Button>)
    } else if (loggedIn === false) {
      return <LoginForm />
    } return <Spinner size='large' />;
  }

  render() {
    console.log(SCREEN_WIDTH * (20 / SCREEN_WIDTH), SCREEN_WIDTH * (2 / SCREEN_WIDTH), width, PixelRatio.getPixelSizeForLayoutSize(width), SCREEN_WIDTH * (SCREEN_WIDTH / 2), SCREEN_WIDTH * (20 / SCREEN_WIDTH))
    return (
      <View style={{ flex: 1, backgroundColor: 'white'}}>
        <Text
        style={styles.header}
        >Log In</Text>
        {this.renderContent()}
        <Text>Already a User? </Text>
        <Text onPress={() => Actions.signup()}>Sign Up</Text>
      </View>
    );
  }
}

const styles = {
  header: {
   textAlign: 'center',
    fontSize: SCREEN_WIDTH * (20 / SCREEN_WIDTH),
    fontFamily: 'Avenir-Book',
    marginTop: SCREEN_WIDTH * (20 / SCREEN_WIDTH)
  }
}

export default connect(({ auth }) => ({ auth }),
  { loginDispatch, loginDispatchFalse, clearForm },
)(Login);
