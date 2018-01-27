import React from 'react';
import { Scene, Router, Actions, Stack } from 'react-native-router-flux';
import {  View } from 'react-native';
import Login from './components/Login'
import Home from './components/Home'
import ForgotPassword from './components/ForgotPassword'
import SignUp from './components/SignUp'
import PreferencesForm from './components/PreferencesForm'
import Search from './components/Search'
import UserProfile from './components/UserProfile'
import Footer from './components/Footer'
import Profile from './components/Profile'
import SavedBooks from './components/SavedBooks'
import Pic from './components/Pic'






const RouterComponent = () => (
  <View style={{flex:1}}>


  <Router>

    <Stack key="root">
      <Scene key="login" component={Login} title="Login"  />
      <Scene key="home" component={Home} initial panHandlers={null} hideNavBar/>
      <Scene key="forgotpassowrd" component={ForgotPassword} />
      <Scene key="preferencesForm" component={PreferencesForm} panHandlers={null} hideNavBar />
      <Scene key="signup" component={SignUp} panHandlers={null} hideNavBar  />
      <Scene key="pic" component={Pic}  />
      <Scene key="profile" component={Profile} panHandlers={null} hideNavBar />
      <Scene key="savedbooks" component={SavedBooks} panHandlers={null} hideNavBar />
      <Scene key="userprofile" component={UserProfile} panHandlers={null} hideNavBar />

    </Stack>

  </Router>
<Footer/>
   </View>
);


export default RouterComponent;
