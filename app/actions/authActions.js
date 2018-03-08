import {
  EMAIL_CHANGED, PASSWORD_CHANGED, PASSWORD_CONFIRM,
  LOGIN_USER_SUCESS, LOGIN_USER_FAIL,
  LOGIN_USER, NOTLOGGEDIN, LOGGEDIN, FORGOT,
  CLEARFORM,
  FORGOT_FAIL,
  FORGOT_SUCCESS
} from './action-types'

import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

export const loginUser = (email, password) => {
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user =>
        loginUserSuccess(dispatch, user))
      .catch((error) => {
        const errorMessage = error.message;
        loginUserFail(dispatch, errorMessage);
      });
  };
};


export const signUpUser = (email, password, confirm) => dispatch => {
  if (password === confirm) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        firebase.database().ref(`users/${user.uid}`).set({ email });
         Actions.popTo('home')
         return loginUserSuccess(dispatch, user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        loginUserFail(dispatch, errorMessage);
      });
  } else {
    const error = 'Passwords do not match'
    loginUserFail(dispatch, error);
  }
};

export const forgotPassword = (emailAddress) =>
  dispatch => {
    dispatch({ type: FORGOT });
    const auth = firebase.auth();
    auth.sendPasswordResetEmail(emailAddress).then(() => {
      console.log('Email sent')
      dispatch({ type: FORGOT_SUCCESS });
    })
    .catch(error => {
      ForgotPasswordFail(dispatch, error.message);
    });
  };


const ForgotPasswordFail = (dispatch, error) => {
  dispatch({
    type: FORGOT_FAIL,
    error
  });
};

const loginUserFail = (dispatch, error) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    error
  });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCESS,
    payload: user
  });
};

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const passwordConfirmChange = (text) =>
  ({ type: PASSWORD_CONFIRM, payload: text });



export const passwordConfirmDispatch = (text) => {
  return dispatch =>
    dispatch(passwordConfirmChange(text));
};


export const emailDispatch = (text) =>
   dispatch =>
    dispatch(emailChanged(text));



export const passwordDispatch = (text) =>
   dispatch =>
    dispatch(passwordChanged(text));


export const loginDispatch = (userId) =>
  dispatch =>{
    if (userId!==undefined){
      dispatch({ type: LOGGEDIN, payload: userId });
    }
  }

export const loginDispatchFalse = () =>
  dispatch =>
    dispatch({ type: NOTLOGGEDIN });

export const clearForm = () =>
  dispatch =>
    dispatch({ type: CLEARFORM });
