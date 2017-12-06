import { 
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES_FIREBASE
} from './action-types'
import firebase from 'firebase';


export const updatedTitle = (title, dispatch) => 
  //console.log('UPDATE TITLE',title);
  dispatch=>dispatch({
    type: UPDATE_TITLE,
    payload: title
  })

export const updatedAuthor = (author, dispatch) => 
  //console.log('UPDATE AUTHOR',author);
  dispatch=> dispatch({
    type: UPDATE_AUTHOR,
    payload: author
  })

export const updatedGenre = (genre, dispatch) => 
  //console.log('UPDATE GENRE',genre);
  dispatch=>dispatch({
    type: UPDATE_GENRE,
    payload: genre
  })

export const updatedPreferencesFireBase = (preferences, userID, dispatch) => {
    console.log('UPDATE ALL PREFERENCES FireBase');
    firebase.database().ref(`users/${userID}/preferences`).set(preferences)
    return (dispatch)=> {
        type: UPDATE_PREFERENCES_FIREBASE
    }
}
