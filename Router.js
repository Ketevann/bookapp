import React from 'react';
import { Scene, Router, Actions, Stack } from 'react-native-router-flux';
import {  View } from 'react-native';
import Login from './components/Login'
import Home from './components/Home'
import ForgotPassword from './components/ForgotPassword'
import SignUp from './components/SignUp'
import PreferencesForm from './components/PreferencesForm'
import Search from './components/Search'
import SavedBooks from './components/SavedBooks'
import Footer from './components/Footer'
import Friends from './components/Friends'
import Profile from './components/Profile'




const RouterComponent = () => (
  <View style={{flex:1}}>


  <Router>

    <Stack key="root">
      <Scene key="login" component={Login} title="Login"  />
      <Scene key="home" component={Home} initial/>
      <Scene key="forgotpassowrd" component={ForgotPassword} />
      <Scene key="preferencesForm" component={PreferencesForm} />
      <Scene key="signup" component={SignUp} />
      <Scene key="savedbooks" component={SavedBooks} />
      <Scene key="friends" component={Friends} />
      <Scene key="profile" component={Profile} />
    </Stack>

  </Router>
          <Footer />

   </View>
);


export default RouterComponent;
