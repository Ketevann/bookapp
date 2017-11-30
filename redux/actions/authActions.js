import { EMAIL_CHANGED, PASSWORD_CHANGED,
  LOGIN_USER_SUCESS, LOGIN_USER_FAIL,
LOGIN_USER, NOTLOGGEDIN,LOGGEDIN} from './action-types'

import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';


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


export const loginUser = ({ email, password }) => {
  console.log('in logins', email, password)

  return (dispatch) => {
    console.log('in dispatch')
    dispatch({type: LOGIN_USER})

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


const loginTrue = () => {
  console.log('in trye')
  return {type: LOGGEDIN}}


const loginFalse = () => {type: NOTLOGGEDIN}


export const loginDispatch = () =>
  dispatch =>

    dispatch({type: LOGGEDIN})

   export const loginDispatchFalse = () =>
     dispatch =>
      dispatch({type: NOTLOGGEDIN})
