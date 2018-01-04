import {
    BOOK_SUGGESTIONS_DATA_RECIEVED,
    CHANGE_SEARCH,
    BOOK_SEARCH,
    BOOK_BOOL,
    AUTHOR_BOOL,
    GET_SAVED_BOOK,
    CLEAR
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
        firebase.database().ref(`users/${userID}/`).child('books').set([{ title: title, read: false }])
    }

export const saveBook = (title, userID, dispatch) =>
        dispatch => {


        firebase.database().ref(`users/${userID}/books`).once('value', (snapshot) => {
                    const savedBook = Object.values(snapshot.val());
                    let hasBook = false;
                     for (var i = 0; i < savedBook.length; i++) {
                            if (savedBook[i].title === title) {
                                    //alert(savedBook[i].title);
                                    hasBook = true;
                            };
                    }

                    hasBook ? alert('already saved') : firebase.database().ref(`users/${userID}/`).child('books').set([...savedBook, { title: title, read: false }]);
            });
    }

export const changeBook = (type, dispatch) =>
    dispatch =>
        dispatch({ type: BOOK_BOOL })

export const changeAuthor = (type, dispatch) =>
    dispatch =>
        dispatch({ type: AUTHOR_BOOL })

export const setSearchValue = (book, dispatch) =>
    dispatch =>
        dispatch({ type: CHANGE_SEARCH, payload: book })

//gets books from a google api
const getBooks = (dispatch, data, author = '') => {
    console.log('in GET BOOKS', author)
    const bookPromises = data.map((book) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=${author}${book.Name}&key=${GOOGLE_API_KEY}`));
    axios.all(bookPromises)
        .then(axios.spread((...args) => {
            //collect returned data for each api call in array
            const bookList = args.map((book) => {
                console.log(book.data.items[0].volumeInfo.title, "title");
                return book.data.items[0].volumeInfo;
            })
            return dispatch({ type: BOOK_SEARCH, payload: bookList })
        })).catch((error) => {
            console.error(error);
        });
}


export const findSimilarBooks = (keyword, placeholder, dispatch) =>
    dispatch => {
        console.log(keyword, 'LEYWORD***', placeholder)
        if (placeholder === 'books') {
            return axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=books`)
                .then(res => {
                    const data = res.data.Similar.Results
                    console.log(data, ' data2222')
                    getBooks(dispatch, data)

                })
        }
        else {
            return axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=authors`)
                .then(res => {
                    console.log(res.data.Similar.Results, 'DATA')
                    const data = res.data.Similar.Results
                    getBooks(dispatch, data, 'inauthor:')
                })
        }
    }

export const getSavedBooks = (user, dispatch) =>
    dispatch => {
        var savedBook = [];
        console.log(' in geeet', user)
        firebase.database().ref(`users/${user}/books`).once('value', (snapshot) => {
            if (snapshot.val())
                savedBook = Object.values(snapshot.val())
            console.log(savedBook, 'savedBook')
            dispatch({ type: GET_SAVED_BOOK, payload: savedBook, user: user })

        })


//export const clearBooks = (dispatch) => {}
    // dispatch =>
    //     dispatch({type: CLEAR})



        // console.log(savedBook, 'savedBook')
    }

// export const getBooks = (user, dispatch) =>
//     dispatch =>
//       dispatch({ type: GET_SAVED_BOOK, payload: savedBook })



export const markAsRead = (uid, title, dispatch) =>
    dispatch => {


        firebase.database().ref(`users/${uid}/books`).once('value', (snapshot) => {
            const savedBook = Object.values(snapshot.val());
            //db books are returned as an object, iterate object and save values (titles) in array
            console.log(snapshot.val(), 'SNAPPPP')



            for (var i = 0; i < snapshot.val().length; i++) {
                console.log(snapshot.val()[i], ' III')
                if (snapshot.val()[i] && snapshot.val()[i].title === title) {
                    index = i;
                    if (snapshot.val()[i].read === true)
                        firebase.database().ref(`users/${uid}/books/${index}`).set({ title: title, read: false })
                    else firebase.database().ref(`users/${uid}/books/${index}`).set({ title: title, read: true })



                    break;
                }
            }

        });




    }






export const removeBooks = (uid, saved, dispatch) =>
    dispatch => {

        console.log('REMOVEEEE', uid, saved)

        firebase.database().ref(`users/${uid}`).child('books').once('value', function (snapshot) {
            var index, savedBooks;
            console.log(snapshot.val(), "saved!!!!")
            if (snapshot.val()) {
                for (var i = 0; i < snapshot.val().length; i++) {
                    if (snapshot.val()[i] && snapshot.val()[i].title === saved) {
                        index = i;
                        firebase.database().ref(`users/${uid}/books/${index}`).set(null)
                        savedBooks = snapshot.val().filter(book => {
                            if (book.title !== snapshot.val()[i].title)
                                return book
                        })

                        console.log('saved books in remove', savedBooks)
                        dispatch({ type: GET_SAVED_BOOK, payload: savedBooks, user: uid })
                        break;
                    }
                }
            }

        });

    }


export const cleaer = (dispatch) =>
    dispatch =>
        dispatch({type: CLEAR})
