import { EMAIL_CHANGED, PASSWORD_CHANGED,
  LOGIN_USER_SUCESS, LOGIN_USER_FAIL,
LOGIN_USER, NOTLOGGEDIN,LOGGEDIN, FORGOT} from './action-types'

import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';




console.log(EMAIL_CHANGED, PASSWORD_CHANGED, ' CHANGEDDD!!!')



export const loginUser = ( email, password ) => {
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
          .then(user =>{
             loginUserSuccess(dispatch, user)
              //saving a new useer profile
              rootRef = firebase.database().ref();
              usersRef = rootRef.child('users');
              console.log("success!");
              const date = new Date();
              console.log(user.uid,"userUID==========++++++");
              usersRef.push().set({
                timeStamp: date.toTimeString(),
                userName: email,
                FirebaseUserID:user.uid,
              })
            })
            .catch(() => loginUserFail(dispatch))
      })
      }
  }

 export const forgotPassword = () =>
 dispatch =>{
   dispatch({type: FORGOT})
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




export const emailDispatch = (text) =>{
 console.log('in email', text)
 return dispatch =>
  dispatch(emailChanged(text))
  }


export const passwordDispatch = (text) =>{
   console.log('in email', text)
 return dispatch =>
  dispatch(passwordChanged(text))

   }

const loginTrue = () => {
  console.log('in trye')
  return {type: LOGGEDIN}}


const loginFalse = () => {type: NOTLOGGEDIN}


export const loginDispatch = (userUID) =>
  dispatch =>
    dispatch({type: LOGGEDIN,
              payload: userUID
        })
        

   export const loginDispatchFalse = () =>
     dispatch =>
      dispatch({type: NOTLOGGEDIN})
