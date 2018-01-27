import {
  EMAIL_CHANGED, PASSWORD_CHANGED, PASSWORD_CONFIRM,
  LOGIN_USER_SUCESS, LOGIN_USER_FAIL,
  LOGIN_USER, NOTLOGGEDIN, LOGGEDIN, FORGOT,
  CLEARFORM
} from './action-types'

import firebase from 'firebase';

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
         return loginUserSuccess(dispatch, user.uid);
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

export const forgotPassword = () =>
  dispatch => {
    dispatch({ type: FORGOT })
    const auth = firebase.auth();
    const emailAddress = "katie.tsin@gmail.com";
    auth.sendPasswordResetEmail(emailAddress).then(() => {
      console.log('Email sent')
    })
    .catch(error => {
      loginUserFail(dispatch, error.message);
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
  dispatch =>
    firebase.database().ref(`users/${userId}/avatar`).once('value', snapshot => {
      let image;
      if(snapshot.val() !== false)
        image = (snapshot.val());
      else image = false;
      dispatch({ type: LOGGEDIN, payload: userId });
    });
export const loginDispatchFalse = () =>
  dispatch =>
    dispatch({ type: NOTLOGGEDIN });

export const clearForm = () =>
  dispatch =>
    dispatch({ type: CLEARFORM });
