import {
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES_FIREBASE,
    FETCHED_SAVED_PREFERENCES
} from './action-types'
import firebase from 'firebase';
import axios from 'axios';
import { TASTE_DIVE_API_KEY } from '../../keys'
import { GOOGLE_API_KEY } from '../../keys'



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

            
export const findSimilar = (keyword, type, dispatch) => axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${type}s`)
            .then(res => {
                const bookPromises = res.data.Similar.Results.map((book) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
                      axios.all(bookPromises).then(axios.spread((...args) => args.map((book) =>book.data.items[0].volumeInfo)))
                       .then((res)=>{
                          return  dispatch({ type: FETCHED_SAVED_PREFERENCES, payload: res }) //store.dispatch?
                        })
            })

export const getPreferences = (userID, dispatch) =>
  dispatch => firebase.database().ref(`users/${userID}/preferences`).once('value', (snapshot) => {
        const preferences= snapshot.val();
        for (key in preferences) {
                switch(key) {
                case 'title':
                    preferences[key] ? findSimilar(preferences[key], 'book', dispatch) : null
                    break;
                case 'author':
                    preferences[key] ? findSimilar(preferences[key], 'author', dispatch) : null
                    break;
                default:
                    console.log('blank');
              }  
            }
    })