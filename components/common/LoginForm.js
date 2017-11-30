import React, { Component } from 'react'
import { View, Text } from 'react-native'
import {Scene, Router, Actions, Stack} from 'react-native-router-flux';

import { Header, Card, CardSection, Button, Input, Spinner } from './'
import firebase from 'firebase';
class LoginForm extends Component {
  state = { email: '', password: '', error: '', loading: false,
    users:[],
    userName:'',
 }


  // componentWillMount() {
  //   // firebase.initializeApp({
  //   //   apiKey: 'AIzaSyAQLrnXMUPqPkfS6IiYI2pqJ-ix0L5ifwI',
  //   //   authDomain: 'test23-8732c.firebaseapp.com',
  //   //   databaseURL: 'https://test23-8732c.firebaseio.com',
  //   //   projectId: 'test23-8732c',
  //   //   storageBucket: 'test23-8732c.appspot.com',
  //   //   messagingSenderId: '196992616531'
  //   // });
  //   this.rootRef = firebase.database().ref();
  //   this.usersRef = this.rootRef.child('users');
  // }

  OnButtonPress() {
    const { email, password } = this.state
    this.setState({ error: '', loading: true })
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(
            this.onLoginSuccess.bind(this))
          .catch(
            this.onLoginFail.bind(this))

      });
  }

  handleAddUser=()=>{
    alert("success!");
    console.log("success!");
    const date = new Date();
    console.log(this.state.users,"users");
    this.usersRef.push().set({
      timeStamp: date.toTimeString(),
      userName: this.state.email,
      FirebaseUserID:firebase.auth().currentUser.uid,
    })
    this.setState({userName: ''})
  }


  onLoginFail() {
    this.setState({ error: 'Authentication Failed', loading: false })
  }

  onLoginSuccess() {
    this.setState({ email: '', password: '', error: '', loading: false })
    this.handleAddUser();
    //will be moved to when a new user is created :)

  }
  renderButton() {
    console.log('button')
    if (this.state.loading === true) {
      return (<Spinner size="small" />)
    }
    return (<Button onPress={this.OnButtonPress.bind(this)}> Login </Button>)
  }

  forgotPassword(){
    var auth = firebase.auth();
var emailAddress = "user@example.com";

auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});
  }

  render() {
    return (
      <View>

        <Card>
          <CardSection>
            <Input
              placeholder="user@gmail.com"
              label="Email"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
          </CardSection>
          <CardSection>
            <Input
              secureTextEntry
              placeholder="123"
              label="Password"
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />
          </CardSection>
          <CardSection>
            <Text>{this.state.error}</Text>
          </CardSection>
          <CardSection>

            {this.renderButton()}

          </CardSection>
          <CardSection>
          <Button onPress={()=> Actions.forgotpassowrd()}>
           Forgot password
            </Button>
          </CardSection>

        </Card>
      </View>

    )
  }
}

styles = {
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

export { LoginForm };
