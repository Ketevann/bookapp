import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Header, Card, CardSection, Button, Input, Spinner } from './common'
import firebase from 'firebase'


class ForgotPassword extends Component {
  state = { email: '', password: '', error: '', loading: false }


//   forgotPassword(){
//  var auth = firebase.auth();
// var emailAddress = "user@example.com";

// auth.sendPasswordResetEmail(emailAddress).then(function() {
//   // Email sent.
// }).catch(function(error) {
//   // An error happened.
// });
//   }

  forgotPassword(){
    var auth = firebase.auth();
var emailAddress = "katie.tsin@gmail.com";

auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
  console.log('sent')
}).catch(function(error) {
  // An error happened.
  console.log(error)
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
            <Button onPress={this.forgotPassword.bind(this)}>Submit</Button>
          </CardSection>

          <CardSection>
            <Text>{this.state.error}</Text>
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

export  default ForgotPassword;
