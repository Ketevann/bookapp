import {
    BOOK_SUGGESTIONS_DATA_RECIEVED,
    CHANGE_SEARCH,
    BOOK_SEARCH,
    BOOK_BOOL,
    AUTHOR_BOOL
} from './action-types'
import { GOOGLE_API_KEY } from '../../keys'
import firebase from 'firebase';
import axios from 'axios';
import { TASTE_DIVE_API_KEY } from '../../keys'

export const getBookSuggestions = (books, dispatch) =>
    dispatch => {
        //sends title in 'books' array to google api and collects promises in array
        const bookPromises = books.map((book) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
        axios.all(bookPromises)
            .then(axios.spread((...args) => {
                //collect returned data for each api call in array
                const bookList = args.map((book) => {
                    console.log(book.data.items[0].volumeInfo.title, "title");
                    return book.data.items[0].volumeInfo;
                })
                return dispatch({
                    type: 'BOOK_SUGGESTIONS_DATA_RECIEVED',
                    payload: bookList //send booklist to redux
                })
            })).catch((error) => {
                console.error(error);
            });
    }


export const createBookShelf = (title, userID, dispatch) =>
    //start a new books branch
    dispatch => {
        firebase.database().ref(`users/${userID}/`).child('books').set([title])
    }

export const saveBook = (title, userID, dispatch) =>
    dispatch => firebase.database().ref(`users/${userID}/books`).once('value', (snapshot) => {
        const savedBook = Object.values(snapshot.val());
        //db books are returned as an object, iterate object and save values (titles) in array
        firebase.database().ref(`users/${userID}/`).child('books').set([...savedBook, title]);
        //add new book and reset books branch                  ( old books ^, new book ^ )
    });



export const changeBook = (type, dispatch) =>
    dispatch =>
        dispatch({ type: BOOK_BOOL })

export const changeAuthor = (type, dispatch) =>
    dispatch =>
        dispatch({ type: AUTHOR_BOOL })

export const setSearchValue = (book, dispatch) =>
    dispatch =>
        dispatch({ type: CHANGE_SEARCH, payload: book })


export const findSimilarBooks = (keyword, dispatch) =>
    dispatch =>{
        if (keyword === 'books') {
          return  axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=10&type=books`)
            .then(res => {
                const data = res.data.Similar.Results
                dispatch({ type: BOOK_SEARCH, payload: data })
            })
         }
         else {
              axios.get(`https://tastedive.com/api/similar?q=${'Hesse'}&k=${TASTE_DIVE_API_KEY}&limit=10&type=authors`)
              .then(res =>{
                 console.log(res.data.Similar.Results, 'DATA')
                 const data = res.data.Similar.Results
                 const allBooks=data.map(elem => axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${elem.Name}&key=AIzaSyCs8Tkv_NUbbfArk39pdi1tRUbqEzBlaaw`));
                     axios.all(allBooks)
                     .then(axios.spread((...args) =>{
                         console.log(args, 'ARGS')
                     }))
                 })
    //           .then(() =>{
    //             const bookPromises = books.map((book) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
    //     axios.all(bookPromises)
    //         .then(axios.spread((...args) => {
    //             //collect returned data for each api call in array
    //             const bookList = args.map((book) => {
    //                 console.log(book.data.items[0].volumeInfo.title, "title");
    //                 return book.data.items[0].volumeInfo;
    //             })
    //             return dispatch({
    //                 type: 'BOOK_SUGGESTIONS_DATA_RECIEVED',
    //                 payload: bookList //send booklist to redux
    //             })
    //         })).catch((error) => {
    //             console.error(error);
    //         });
    // }



             // })

            //  .then(res =>{
            //      console.log(res.data,' google' )
            //  })
         }
    }
