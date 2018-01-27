import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import LoginForm from './common/LoginForm';
import { loginDispatch, loginDispatchFalse, clearForm } from '../redux/actions/authActions';



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
    return (
      <View style={{ flex: 1 }}>
        <Header headerText="Authentication" />
        {this.renderContent()}
        <Text>Already a User? </Text>
        <Text onPress={() => Actions.signup()}>Sign Up</Text>
      </View>
    );
  }
}

export default connect(({ auth }) => ({ auth }),
  { loginDispatch, loginDispatchFalse, clearForm },
)(Login);
