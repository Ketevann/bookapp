import {
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES_FIREBASE
} from './action-types'
import firebase from 'firebase';


console.log('PREFERENCES CHANGED!!!');

export const updatedTitle = (title) => {
  console.log('UPDATE TITLE',title);
  return {
    type: UPDATE_TITLE,
    payload: title
  }
}

export const updatedAuthor = (author) => {
  console.log('UPDATE AUTHOR',author);
  return {
    type: UPDATE_AUTHOR,
    payload: author
  }
}

export const updatedGenre = (genre) => {
  console.log('UPDATE GENRE',genre);
  return {
    type: UPDATE_GENRE,
    payload: genre
  }
}
export const updatedPreferencesFireBase = (preferences, userUID) => {
    console.log('UPDATE ALL PREFERENCES FireBase');
    firebase.database().ref("users").orderByChild("FirebaseUserID").equalTo(userUID).on("child_added", (snapshot)=>{
        firebase.database().ref().child('users').child(snapshot.key).push(preferences);
    })
    return {
        type: UPDATE_PREFERENCES_FIREBASE
    }
}
