import {
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES,
    FETCHED_BOOKS,
    CLEAR_BOOKS
} from './action-types'
import firebase from 'firebase';
import axios from 'axios';
import { TASTE_DIVE_API_KEY } from '../../keys'
import { GOOGLE_API_KEY } from '../../keys'
import   defaultBooks  from '../../components/data/defaultBooks';
import { Actions } from 'react-native-router-flux';



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

export const updatePreferences = (preferences, userID) => dispatch=>
    {  
        console.log('UPDATE ALL PREFERENCES FireBase', preferences);
        const {author, genre, title} = preferences
        firebase.database().ref(`users/${userID}`).child(`preferences`).set({author, title, genre});
        dispatch(clearBooks(dispatch));
            Actions.home()
    }


export const getBooksData = (books, dispatch) => {
    //clearBooks(dispatch);
    //alert('getBooksData')
    const bookPromises = books.map((book) => 
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
        axios.all(bookPromises)
            .then(axios.spread((...args) => args.map((book) => book.data.items[0].volumeInfo))).then((res)=> dispatch({ type: FETCHED_BOOKS, payload: res })) //save to state
                .catch((error) => {
                    console.error(error);
                });
    }


export const getDefualt = dispatch => dispatch => getBooksData(defaultBooks.list, dispatch);//send default books to google api

export const clearBooks = dispatch =>dispatch=> { alert('clear'); return dispatch({ type: CLEAR_BOOKS})};//clears preferences books array 

export const findSimilar = (keyword, type, dispatch) => {
    //alert('findSimilar');
    let mediaType = null;
        type === 'title' ? mediaType='book' : mediaType = 'author';
        axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${mediaType}s`)
            .then(res => getBooksData(res.data.Similar.Results, dispatch))
                .catch((error) => {
                    console.error(error);
                });
}

export const validate = (preferences) => {
        if (preferences){
            //turns object values into array, then filters for non-empty, returns 0 if (object exists but is empty ) or a value
            return Object.values(preferences).filter(preference =>  preference!=="").length;
        } else return null //return null if no preferences object exists 
}

export const getPreferences = ( userID,dispatch ) =>
    dispatch => firebase.database().ref(`users/${userID}/preferences`).once('value', (snapshot) => {
        const preferences= snapshot.val();//this is the  preferences object
        //alert(validate(preferences));
        if (validate(preferences)){ //chceck if preferences exist, then iterate the object and get pereferred books/authors 
            for (key in preferences){
                preferences[key] ? findSimilar(preferences[key], key, dispatch) : null;
            }
        } else getBooksData(defaultBooks.list, dispatch)//load default books if there's no preferences saved, validate retirned 0 or null
    })



 