import {
    CHANGE_SEARCH,
    BOOK_SEARCH,
    GET_SAVED_BOOK,
    LOAD_SAVED_BOOKS,
    BOOK_SEARCH_CLEAR,
    LOADING,
    SEARCH_TYPE,
    SEARCH_QUERY_SUCCESS,
    SEARCH_BOOKS_CLEAR,
    SEARCH_PARAMS_CLEAR
} from './action-types'
import { GOOGLE_API_KEY } from '../../keys'
import firebase from 'firebase';
import axios from 'axios';
import { TASTE_DIVE_API_KEY } from '../../keys'
import { defaultBookImg } from '../../components/data/defaultBookImg';
import defaultBooks from '../../components/data/defaultBooks';
import * as cloudscraper from 'react-native-cloudscraper'
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
                    if ((savedBook[i].title === title) &&
                        (savedBook[i].author === author) &&
                        (savedBook[i].description === description)) {
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

export const changeSearchBookQuery = (query, dispatch) =>
    dispatch =>
        dispatch({ type: SEARCH_TYPE, query })



export const setSearchValue = (book, dispatch) =>
    dispatch =>
        dispatch({ type: CHANGE_SEARCH, payload: book })

export const clearSearch = (dispatch) =>//clearing search bar
    dispatch=>
        dispatch({ type: SEARCH_PARAMS_CLEAR})

export const clearSearchedBooks = (dispatch) =>//clearing search book results from state
    dispatch=>
        dispatch({ type: SEARCH_BOOKS_CLEAR })

//gets books from a google api
const getBooks = (dispatch, data, userId, author = '', ) => {//added user id
    //  console.log('in GET BOOKS', author)
    const bookPromises = data.map((book) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=${author}${book.Name}&key=${GOOGLE_API_KEY}`));
    axios.all(bookPromises)
        .then(axios.spread((...args) => {
            //collect returned data for each api call in array
            const bookList = args.map((book) => {
                let currentBook = book.data.items[0].volumeInfo;
                const newBook = {
                    title: currentBook.title,
                    author: currentBook.authors ? currentBook.authors[0] : 'No authors available',
                    description: currentBook.description ? currentBook.description : 'No description available',
                    imageLinks: currentBook.imageLinks ? currentBook.imageLinks : { smallThumbnail: defaultBookImg },//if no image link, add a default image
                    categories: currentBook.categories ? currentBook.categories : 'No categories available',
                    pageCount: currentBook.pageCount ? currentBook.pageCount : 'No page count available'
                };
                return newBook;
            })
            if (bookList.length !== 0) firebase.database().ref(`users/${userId}/suggestions`).set([...bookList]);//save suggested books to db, only if there are results, invalid input will not return results
            return dispatch({ type: BOOK_SEARCH, payload: bookList })
        })).catch((error) => {
            console.error(error);
        });
}
export const findSimilarBooks = (keyword, placeholder, userId, dispatch) =>
    dispatch => {
        const suggestionsRef = firebase.database().ref(`users/${userId}/suggestions`);
        suggestionsRef.once('value')//deletes previous suggested books
            .then(snapshot => {
                if (snapshot.val()) {
                    suggestionsRef.set(null);
                }
            });
            return cloudscraper.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${placeholder}`)
                .then(res => {
                    const data = JSON.parse(res._bodyText).Similar.Results;
                    let query = '';
                    if (placeholder === 'author')
                        query = 'inauthor:';
                    getBooks(dispatch, data, userId, query);
                })
                .catch(err => console.log(err));
    }

export const searchSavedBooks = (keyword, placeholder, userId, dispatch) =>
    dispatch => {
        dispatch({ type: LOADING });//updates loading in saved books to true
        firebase.database().ref(`users/${userId}/books`).once('value', (snapshot) => {
            
            dispatch({ type: SEARCH_PARAMS_CLEAR })//clears search form

            if (snapshot.val()){  //if books branch exists
                let savedBooksArray = snapshot.val();
                if (Array.isArray(snapshot.val()) === false) {
                    savedBooksArray = Object.values(snapshot.val());
                }
                if (placeholder==='books') placeholder='title';
                books = savedBooksArray.filter(book => {        //filtering books that meet search parameters 
                    keyword=keyword.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');//removing empty spaces from both ends 
                    return book[placeholder]=== keyword || book[placeholder].match(keyword)!==null// comparing search paramater to book data
                });

                return dispatch({ type: SEARCH_QUERY_SUCCESS, payload: books })//setting books to state
            }
        });
}

export const getSavedBooks = (user, dispatch) =>
    dispatch => {
        dispatch({ type: LOADING });//updates loading in saved books to true
        var savedBook = [];
        console.log(' in geeet', user)
        firebase.database().ref(`users/${user}/books`).once('value', (snapshot) => {
            if (snapshot.val())
                savedBook = Object.values(snapshot.val())
            dispatch({ type: GET_SAVED_BOOK, payload: savedBook, user: user });
        });
    };


export const markAsRead = (uid, title, dispatch) =>
    dispatch => {
        firebase.database().ref(`users/${uid}/books`).once('value', (snapshot) => {
            let bool,
                index,
                savedBooksArray = snapshot.val();
            if (Array.isArray(snapshot.val()) === false) {
                savedBooksArray = Object.values(snapshot.val());
            }
            for (let i = 0; i < savedBooksArray.length; i++) {
                if (savedBooksArray[i] && savedBooksArray[i].title === title) {
                    index = i;
                    if (savedBooksArray[i].read === true) bool = false; else bool = true
                    firebase.database().ref(`users/${uid}/books/${index}`).update({ read: bool });
                    savedBooksArray[i].read = bool;
                    return dispatch({ type: GET_SAVED_BOOK, payload: savedBooksArray, user: uid });
                }
            }
        });
    };

export const reRenderSearch = ( books, title, updateType, dispatch) =>//takes current array of searched books, deletes/updates read, then sets that updated array to state (our searchQuery variable)
    dispatch => {                                                     //thus forcing a re-render of searched books ans we see changes in icon or the deleted book goes away 
            if (updateType==='read'){
                for (let i = 0; i < books.length; i++) {
                    let book = books[i];
                    
                    if (book && book.title === title) {
                       book.read = !book.read; //updating read
                    }
                }
            } else {
                books = books.filter(book => {
                    if (book.title !== title) //filtering out the deleted book
                        return book;
                });
            }
            return dispatch({ type: SEARCH_QUERY_SUCCESS, payload: books }); //setting updated books to state
    };
    
export const removeBooks = (uid, saved, dispatch) =>
    dispatch => {
        firebase.database().ref(`users/${uid}`).child('books').once('value', function (snapshot) {
            let index,
                savedBooks,
                savedBooksArray;
            if (snapshot.val()) {
                savedBooksArray = snapshot.val();
                if (Array.isArray(snapshot.val()) === false) {
                    savedBooksArray = Object.values(snapshot.val())
                }
                savedBooks = savedBooksArray.filter(book => {
                    if (book.title !== saved)
                        return book
                });
                dispatch({ type: GET_SAVED_BOOK, payload: savedBooks, user: uid });
                firebase.database().ref(`users/${uid}/books`).set(savedBooks);
            }
        });
    }

export const loadingSearchResults = dispatch =>
    dispatch =>
        dispatch({ type: LOAD_SAVED_BOOKS })

export const clearSearchBooks = dispatch =>
    dispatch =>
        dispatch({ type: BOOK_SEARCH_CLEAR })



//gets books from suggestions
export const getSuggestions = (userID, dispatch) =>//we call this function in componentWillMount, so we dont need to call a display function
    dispatch => {
        dispatch({ type: LOAD_SAVED_BOOKS })
        const suggestionsRef = firebase.database().ref(`users/${userID}/suggestions`);
        suggestionsRef.once('value')//if there are suggestions we load those to state
            .then(function (snapshot) {
                if (!snapshot.val())
                    throw ("Error");
                const suggestions = Object.values(snapshot.val());
                dispatch({ type: BOOK_SEARCH, payload: suggestions })
            })
            .catch((error) =>  firebase.database().ref(`default`).once('value', (snapshot) => {//setting defualt books to suggestions branch
                                    const defaultBooks = snapshot.val();
                                    suggestionsRef.set([...defaultBooks]);
                                    dispatch({ type: BOOK_SEARCH, payload: defaultBooks });
                                })
            )
    };

// //when no suggested books are saved, we load defualt books
export const getDefualt = dispatch =>//setting defualt books to suggestions state
    dispatch =>
        firebase.database().ref(`default`).once('value', (snapshot) => {
            const defaultBooks = snapshot.val();
            dispatch({ type: BOOK_SEARCH, payload: defaultBooks });
        });

//used when we need to update the defualt books branch
export const updateDefaultSuggestions = (userID,author='', dispatch) =>
    dispatch =>{
        const bookPromises = defaultBooks.list.map((book) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=${author}${book.Name}&key=${GOOGLE_API_KEY}`));
        axios.all(bookPromises)
        .then(axios.spread((...args) => {
            //collect returned data for each api call in array
            const bookList = args.map((book) => {
                let currentBook = book.data.items[0].volumeInfo;
                const newBook = {
                    title: currentBook.title,
                    author: currentBook.authors ? currentBook.authors[0] : 'No authors available',
                    description: currentBook.description ? currentBook.description : 'No description available',
                    imageLinks: currentBook.imageLinks ? currentBook.imageLinks : { smallThumbnail: defaultBookImg },//if no image link, add a default image
                    categories: currentBook.categories ? currentBook.categories : 'No categories available',
                    pageCount: currentBook.pageCount ? currentBook.pageCount : 'No page count available'
                };
                return newBook;
            })
            if (bookList.length !== 0)  firebase.database().ref(`default`).set([...bookList]); //save suggested books to db, only if there are results, invalid input will not return results
        })).catch((error) => {
            console.error(error);
        });
      
           
    }



export const removeSuggestion = (suggested, uid, dispatch) =>
    dispatch => {
        firebase.database().ref(`users/${uid}`).child('suggestions').once('value', function (snapshot) {
            let index, suggestions;
            if (snapshot.val()) {
                suggestions = snapshot.val();
                if (Array.isArray(snapshot.val()) === false) {
                    suggestions = Object.values(snapshot.val())
                }
                for (let i = 0; i < suggestions.length; i++) {
                    if (suggestions[i] && suggestions[i].title === suggested) {
                        suggestions.splice(i, 1);
                        break;
                    }
                }
                firebase.database().ref(`users/${uid}/suggestions`).set(suggestions)
            }
        });
    };
