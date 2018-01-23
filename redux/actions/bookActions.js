import {
    BOOK_SUGGESTIONS_DATA_RECIEVED,
    CHANGE_SEARCH,
    BOOK_SEARCH,
    BOOK_BOOL,
    AUTHOR_BOOL,
    GET_SAVED_BOOK,
    READ,
    CLEAR,
    LOAD_SAVED_BOOKS
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


// export const createBookShelf = (book, userID, dispatch) =>
//     //start a new books branch

//     dispatch => {
//         console.log(book, userID, '***')
//         const { author, description, imageLinks, title } = book;
//         firebase.database().ref(`users/${userID}/`).child('books').set([{ title: title, read: false, author: author, description: description ? description:null, image: imageLinks }])
//     }

export const saveBook = (book, userID, dispatch) =>
    dispatch => {
        console.log(book, userID, '*** save')
        const { author, description, imageLinks, title, categories, pageCount } = book;
        const newBook = {
            title: title,
            author: author,
            description: description,
            image: imageLinks,
            read: false,
            categories: categories,
            pageCount: pageCount
        }

        firebase.database().ref(`users/${userID}/books`).once('value')
            .then(snapshot => {
                if (!snapshot.val())//checking if a books branch exists in firebase
                    throw ("Error")

                const savedBook = Object.values(snapshot.val());
                let hasBook = false;
                for (var i = 0; i < savedBook.length; i++) {
                    // if (savedBook[i].title === title) {
                    //     //alert(savedBook[i].title);
                    //     hasBook = true;
                    // };
                    if ((savedBook[i].title === title) &&
                        (savedBook[i].author === author) &&
                        (savedBook[i].description === description)) {
                        //alert(savedBook[i].title);
                        hasBook = true;
                        break;
                    };

                }
                //added ternary on description, error thrown when discription is undefined
                hasBook ? alert('already saved') : firebase.database().ref(`users/${userID}/`).child('books').set([...savedBook, newBook]);
            })
            .catch(error => {
                //starting a books branch in firebase if none exists already
                firebase.database().ref(`users/${userID}/`).child('books').set([newBook]);
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
                let currentBook = book.data.items[0].volumeInfo;
                const newBook = {
                    title: currentBook.title,
                    author: currentBook.authors ? currentBook.authors[0] : '',
                    description: currentBook.description ? currentBook.description : '',
                    imageLinks: currentBook.imageLinks ? currentBook.imageLinks : '',
                    categories: currentBook.categories ? currentBook.categories : '',
                    pageCount: currentBook.pageCount ? currentBook.pageCount : ''
                };
                return newBook;
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
        dispatch({ type: LOAD_SAVED_BOOKS, payload: true })
        console.log(' in geeet', user)
        firebase.database().ref(`users/${user}/books`).once('value', (snapshot) => {
            if (snapshot.val())
                savedBook = Object.values(snapshot.val())
            console.log(savedBook, 'savedBook')
            dispatch({ type: GET_SAVED_BOOK, payload: savedBook, user: user })
            dispatch({ type: LOAD_SAVED_BOOKS, payload: false })

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

            let bool,
                savedBooksArray = snapshot.val();
            if (Array.isArray(snapshot.val()) === false) {
                console.log('false')
                savedBooksArray = Object.values(snapshot.val())
                console.log(savedBooksArray, 'ddd');
            }
            for (var i = 0; i < savedBooksArray.length; i++) {
                console.log(savedBooksArray[i], ' III')
                if (savedBooksArray[i] && savedBooksArray[i].title === title) {
                    index = i;
                    if (savedBooksArray[i].read === true)
                        bool = false
                    else bool = true
                    firebase.database().ref(`users/${uid}/books/${index}`).update({ read: bool })
                    savedBooksArray[i].read = bool;
                    // else firebase.database().ref(`users/${uid}/books/${index}`).update({  read: true })
                    return dispatch({ type: GET_SAVED_BOOK, payload: savedBooksArray, user: uid })


                    break;
                }
            }

        });




    }






export const removeBooks = (uid, saved, dispatch) =>
    dispatch => {

        console.log('REMOVEEEE', uid, saved)

        firebase.database().ref(`users/${uid}`).child('books').once('value', function (snapshot) {
            let index, savedBooks, savedBooksArray

            console.log(snapshot.val(), "saved!!!!")
            if (snapshot.val()) {
                savedBooksArray = snapshot.val();
                if (Array.isArray(snapshot.val()) === false) {
                    console.log('false')
                    savedBooksArray = Object.values(snapshot.val())
                    console.log(savedBooksArray, 'ddd');
                }
                for (var i = 0; i < savedBooksArray.length; i++) {
                    console.log(savedBooksArray[i], ' array')
                    if (savedBooksArray[i] && savedBooksArray[i].title === saved) {
                        index = i;

                        savedBooks = savedBooksArray.filter(book => {
                            if (book.title !== savedBooksArray[i].title)
                                return book
                        })

                        console.log('saved books in remove', savedBooks)
                        dispatch({ type: GET_SAVED_BOOK, payload: savedBooks, user: uid })
                        break;
                    }
                }
                firebase.database().ref(`users/${uid}/books`).set(savedBooks)
                console.log(savedBooks, 'sss')
            }

        });

    }
