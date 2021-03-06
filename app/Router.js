import React from 'react';
import { Scene, Router, Actions, Stack } from 'react-native-router-flux';
import { View } from 'react-native';
import Login from './components/Login'
import Home from './components/Home'
import ForgotPassword from './components/ForgotPassword'
import SignUp from './components/SignUp'
import SearchComponent from './components/Search'
import Footer from './components/Footer'
import Profile from './components/Profile'


const RouterComponent = () => (
  <View style={{ flex: 1 }}>
    <Router>
      <Stack key="root">
        <Scene key="login" component={Login} />
        <Scene key="home" component={Home} initial />
        <Scene key="forgotpassowrd" component={ForgotPassword} />
        <Scene key="signup" component={SignUp} panHandlers={null} renderBackButton={() => (null)} />
        <Scene key="profile" component={Profile} />
      </Stack>
    </Router>
    <Footer/>
  </View>
);

export default RouterComponent;
