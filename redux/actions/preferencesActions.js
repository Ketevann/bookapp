import {
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES,
    FETCHED_BOOKS
} from './action-types'
import firebase from 'firebase';
import axios from 'axios';
import { TASTE_DIVE_API_KEY } from '../../keys'
import { GOOGLE_API_KEY } from '../../keys'



export const updateTitle = (title, dispatch) =>
  //console.log('UPDATE TITLE',title);
  dispatch => dispatch({
    type: UPDATE_TITLE,
    payload: title
  })

export const updateAuthor = (author, dispatch) =>
  //console.log('UPDATE AUTHOR',author);
  dispatch => dispatch({
    type: UPDATE_AUTHOR,
    payload: author
  })

export const updateGenre = (genre, dispatch) =>
  //console.log('UPDATE GENRE',genre);
  dispatch => dispatch({
    type: UPDATE_GENRE,
    payload: genre
  })

export const updatePreferences = (preferences, userID, dispatch) =>
    dispatch => {
        console.log('UPDATE ALL PREFERENCES FireBase', preferences);
        const {author, genre, title} = preferences
        firebase.database().ref(`users/${userID}`).child(`preferences`).set({author, title, genre});
        dispatch({ type: UPDATE_PREFERENCES })
    }


export const getBooksData = (books, dispatch) => {
    const bookPromises = books.map((book) => 
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
        axios.all(bookPromises)
            .then(axios.spread((...args) => args.map((book) => book.data.items[0].volumeInfo))).then((res)=> dispatch({ type: FETCHED_BOOKS, payload: res })) //save to state
                .catch((error) => {
                    console.error(error);
                });
    }
 

export const findSimilar = (keyword, type, dispatch) => {
    var mediaType=null;
    type==='title'? mediaType='book': mediaType='author';
    axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${mediaType}s`)
        .then(res => getBooksData(res.data.Similar.Results, dispatch))
            .catch((error) => {
                console.error(error);
            });
}


export const getPreferences = ( userID,dispatch ) =>
    dispatch => firebase.database().ref(`users/${userID}/preferences`).once('value', (snapshot) => {
        if (snapshot.val()){ //if preferences are saved then iterate object and get perefered books
            const preferences= snapshot.val();
            for (key in preferences) {
                preferences[key] ? findSimilar(preferences[key], key, dispatch) : null;
            }
        } else getBooksData(defaultBooks.list, dispatch)//load default books if there's no preferences saved
    })



 