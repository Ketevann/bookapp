import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Card, CardSection, Button, Input } from './common'
import { connect } from 'react-redux'
import { forgotPassword, emailDispatch } from '../redux/actions/authActions'

class ForgotPassword extends Component {


onForgotPassword(email) {
  this.props.forgotPassword(email);
}

 onEmailChange(text) {
  this.props.emailDispatch(text);
  }
  render() {
    return (
      <View>
        <Card>
          <CardSection>
            <Input
              placeholder="user@gmail.com"
              label="Email"
              value={this.props.auth.email}
              onChangeText={this.onEmailChange.bind(this)}
            />
          </CardSection>
          <CardSection>
            <Button onPress={this.onForgotPassword.bind(this)}>Submit</Button>
          </CardSection>
          <CardSection>
            <Text>{this.props.auth.error}</Text>
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
};

export default connect(({ auth }) => ({ auth }), { forgotPassword, emailDispatch })(ForgotPassword);
