import {
  EMAIL_CHANGED, PASSWORD_CHANGED, PASSWORD_CONFIRM,
  LOGIN_USER_SUCESS, LOGIN_USER_FAIL,
  LOGIN_USER, NOTLOGGEDIN, LOGGEDIN, FORGOT
} from './action-types'

import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {getSavedBooks} from './bookActions'


console.log(EMAIL_CHANGED, PASSWORD_CHANGED, ' CHANGEDDD!!!')



export const loginUser = (email, password) => {
  console.log('in logins', email, password)


  return (dispatch) => {
    console.log('in dispatch')
    dispatch({ type: LOGIN_USER })

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user =>
        loginUserSuccess(dispatch, user))
      .catch((error) => {
        console.log('erro', error)

        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user =>
            loginUserSuccess(dispatch, user))
          .catch(() => loginUserFail(dispatch))
      })
  }
}


export const signUpUser = (email, password, confirm) => dispatch => {
  console.log('in signup', email, password, confirm, '****')
console.log('signed checked', password === confirm)
  if (password === confirm) {
    console.log('confirmed!!!!!')
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user =>{
            console.log('signed uppppp yoo', user)
            firebase.database().ref(`users/${user.uid}`).set({ email: email, avatar: false })//saving user email to db
            Actions.preferencesForm()
           return loginUserSuccess(dispatch, user)

            })
     .catch(() => loginUserFail(dispatch))
}
else {
  loginUserFail(dispatch)
}
}


export const forgotPassword = () =>
  dispatch => {
    dispatch({ type: FORGOT })
    var auth = firebase.auth();
    var emailAddress = "katie.tsin@gmail.com";
    auth.sendPasswordResetEmail(emailAddress).then(function () {
      // Email sent.
      console.log('sent')
    }).catch(function (error) {
      // An error happened.
      console.log(error)
    });
  }


const loginUserFail = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_FAIL,
    user
  });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCESS,
    payload: user
  });
  //Actions.main();
};



export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  }
}



export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  }
}

export const passwordConfirmChange = (text) =>
  ({ type: PASSWORD_CONFIRM, payload: text })



export const passwordConfirmDispatch = (text) => {
  console.log('in email', text)
  return dispatch =>
    dispatch(passwordConfirmChange(text))
}


export const emailDispatch = (text) => {
  return dispatch =>
    dispatch(emailChanged(text))
}


export const passwordDispatch = (text) => {
  return dispatch =>
    dispatch(passwordChanged(text))

}

const loginTrue = () => {
  console.log('in trye')
  return { type: LOGGEDIN }
}


const loginFalse = () => { type: NOTLOGGEDIN }


export const loginDispatch = (userId) =>
  dispatch =>
    dispatch({ type: LOGGEDIN, payload: userId})

export const loginDispatchFalse = () =>
  dispatch =>
    dispatch({ type: NOTLOGGEDIN })



