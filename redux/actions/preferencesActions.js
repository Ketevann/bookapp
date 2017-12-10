import {
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES_FIREBASE,
    FETCHED_SAVED_PREFERENCES
} from './action-types'
import firebase from 'firebase';


export const updatedTitle = (title, dispatch) =>
  //console.log('UPDATE TITLE',title);
  dispatch => dispatch({
    type: UPDATE_TITLE,
    payload: title
  })

export const updatedAuthor = (author, dispatch) =>
  //console.log('UPDATE AUTHOR',author);
  dispatch => dispatch({
    type: UPDATE_AUTHOR,
    payload: author
  })

export const updatedGenre = (genre, dispatch) =>
  //console.log('UPDATE GENRE',genre);
  dispatch => dispatch({
    type: UPDATE_GENRE,
    payload: genre
  })

export const updatedPreferencesFireBase = (preferences, userID, dispatch) =>
dispatch => {
    console.log('UPDATE ALL PREFERENCES FireBase', preferences);
    const {author, genre, title} = preferences
    firebase.database().ref(`users/${userID}`).child(`preferences`).set({author, title, genre});
    return (dispatch) => dispatch({ type: UPDATE_PREFERENCES_FIREBASE })
}

export const getPreferences = (userID, dispatch) =>
    dispatch => firebase.database().ref(`users/${userID}/preferences`).once('value', (snapshot) => {
        const preferences = Object.values(snapshot.val());
        console.log(preferences,  "-->in redux");//testing to see if function was activated
        dispatch({ type: FETCHED_SAVED_PREFERENCES, payload: preferences })
    });