import React from 'react';
import {Scene, Router, Actions, Stack} from 'react-native-router-flux';
import Login from './components/Login'
import Home from './components/Home'
import ForgotPassword from './components/ForgotPassword'
import PreferencesForm from './components/PreferencesForm'



const RouterComponent = () => (
  <Router>
    <Stack key="root">
      <Scene key="login" component={Login} title="Login" />
      <Scene key="home" component={Home} initial />
      <Scene key="forgotpassowrd" component={ForgotPassword} />
      <Scene key="preferencesForm" component={PreferencesForm} />
    </Stack>
  </Router>
);


export default RouterComponent;
