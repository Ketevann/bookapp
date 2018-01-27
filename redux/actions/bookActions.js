import {
    BOOK_SUGGESTIONS_DATA_RECIEVED,
    CHANGE_SEARCH,
    BOOK_SEARCH,
    BOOK_BOOL,
    AUTHOR_BOOL,
    GET_SAVED_BOOK,
    READ,
    CLEAR,
    LOAD_SAVED_BOOKS,
    BOOK_SEARCH_CLEAR,
    LOADING,
    UPDATE_SUGGESTIONS
} from './action-types'
import { GOOGLE_API_KEY } from '../../keys'
import firebase from 'firebase';
import axios from 'axios';
import { TASTE_DIVE_API_KEY } from '../../keys'
import  * as cloudscraper from 'react-native-cloudscraper'
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
                    author: currentBook.authors ? currentBook.authors[0] : '',
                    description: currentBook.description ? currentBook.description : '',
                    imageLinks: currentBook.imageLinks ? currentBook.imageLinks : '',
                    categories: currentBook.categories ? currentBook.categories : '',
                    pageCount: currentBook.pageCount ? currentBook.pageCount : ''
                };
                return newBook;
            })
            if (bookList.length!==0) firebase.database().ref(`users/${userId}/suggestions`).set([...bookList]);//save suggested books to db, only if there are results, invalid input will not return results
            return dispatch({ type: BOOK_SEARCH, payload: bookList })
        })).catch((error) => {
            console.error(error);
        });
}


export const findSimilarBooks = (keyword, placeholder, userId, dispatch) =>
    dispatch => {
        console.log(keyword, 'LEYWORD***', placeholder)
        if (placeholder === 'books') {
            return cloudscraper.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=books`)
                .then(res => {

                     console.log(res, ' data2222', JSON.parse(res._bodyText).Similar.Results)
                     const data = JSON.parse(res._bodyText).Similar.Results;

                    getBooks(dispatch, data, userId)//added user id

                })
                .catch(err=> console.log(err))
        }
        else {
            return cloudscraper.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=authors`)
                .then(res => {
                  console.log(res, ' data2222', JSON.parse(res._bodyText).Similar.Results)
                      const data = JSON.parse(res._bodyText).Similar.Results;

                    getBooks(dispatch, data,userId, 'inauthor:')//added user id

                   // getBooks(dispatch, data, 'inauthor:')
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

       // console.log('REMOVEEEE', uid, saved)

        firebase.database().ref(`users/${uid}`).child('books').once('value', function (snapshot) {
            let index, savedBooks, savedBooksArray

           // console.log(snapshot.val(), "saved!!!!")
            if (snapshot.val()) {
                savedBooksArray = snapshot.val();
                if (Array.isArray(snapshot.val()) === false) {
                  //  console.log('false')
                    savedBooksArray = Object.values(snapshot.val())
                   // console.log(savedBooksArray, 'ddd');
                }
                //for (var i = 0; i < savedBooksArray.length; i++) {
                  //  console.log(savedBooksArray[i], ' array')
                    //if (savedBooksArray[i] && savedBooksArray[i].title === saved) {
                        //index = i;

                        savedBooks = savedBooksArray.filter(book => {
                            if (book.title !== saved)
                                return book
                        })

                      // console.log('saved books in remove', savedBooks)
                        dispatch({ type: GET_SAVED_BOOK, payload: savedBooks, user: uid })
                        //break;
                   // }
                //}
                firebase.database().ref(`users/${uid}/books`).set(savedBooks)
               // console.log(savedBooks, 'sss')
            }

        });

    }

export const loadingSearchResults = dispatch =>
    dispatch =>
        dispatch({ type: LOAD_SAVED_BOOKS })

export const clearSearchBooks = dispatch =>
    dispatch =>
        dispatch({ type: BOOK_SEARCH_CLEAR })


export const loadPrefBooks = (userID, dispatch) => {// we dont need to call a display function
    const suggestionsRef = firebase.database().ref(`users/${userID}/suggestions`);
    alert('loadPrefBooks')
    firebase.database().ref(`users/${userID}/`).child('preferences').once('value')

        .then(snapshot => {
            const preferences = snapshot.val();//this is the  preferences object
            if (!snapshot.val())
                throw ("Error")


            return find(preferences);//calling TasteDive
            //we return a promise that resolves into array of titles to be sent to googleAPI
        })
        .then((similarTitles) => {
            const data = JSON.parse(similarTitles._bodyText).Similar.Results;
            return getBooks(data)//calling googleAPI
        })
        .then((booksData) => {
            console.log(booksData,' booksDAta')
            suggestionsRef.set([...booksData]);
            dispatch({ type: UPDATE_SUGGESTIONS, payload: booksData });
        })
        .catch(error => {
            console.log("no prefs, loading defualt suggestions");
            //we have a defualt branch in firebase,
            firebase.database().ref(`default`).once('value', (snapshot) => {
                const defaultBooks = snapshot.val();
                suggestionsRef.set([...defaultBooks]);//setting defualt books to suggestions branch
                dispatch({ type: UPDATE_SUGGESTIONS, payload: defaultBooks });
            })
        })

}

//gets books from suggestions
export const getSuggestions = (userID, dispatch) =>//we call this function in componentWillMount, so we dont need to call a display function
    dispatch =>{
        dispatch({ type: LOADING , payload: true })
        firebase.database().ref(`users/${userID}/suggestions`).once('value')//if there are suggestions we load those to state
            .then(function (snapshot) {
                if (!snapshot.val())
                    throw ("Error")

                const suggestions = Object.values(snapshot.val());
                dispatch({ type: UPDATE_SUGGESTIONS, payload: suggestions })
                dispatch({ type: LOADING , payload: false })

            })
            .catch((error) => loadPrefBooks(userID, dispatch))//else check for preferences, if none, load default
    }
    
    //when no suggested books are saved, we load defualt books
    export const getDefualt = (dispatch) =>//setting defualt books to suggestions state
    dispatch => firebase.database().ref(`default`).once('value', (snapshot) => {
        const defaultBooks = snapshot.val();
        dispatch({ type: UPDATE_SUGGESTIONS, payload: defaultBooks });
    })
    
    //used when we need to update the defualt books branch
    export const updateDefaultSuggestions = (userID, dispatch) =>
        dispatch => getBooksFromApi(defaultBooks.list).then((defaultSuggestions) => {
        console.log(defaultSuggestions, 'defaultSgugest')
        firebase.database().ref(`default`).set([...defaultSuggestions]);
    })



export const removeSuggestion = (suggested, uid, dispatch) =>
    dispatch => {
        //alert(suggested);
        console.log('REMOVEEEE', uid, suggested)
        firebase.database().ref(`users/${uid}`).child('suggestions').once('value', function (snapshot) {
            var index, suggestions;
           // console.log(snapshot.val(), "removing!!!!")
            if (snapshot.val()) {
                suggestions=snapshot.val();

                // console.log(snapshot.val(), "removing!!!!")
                  if (Array.isArray(snapshot.val()) === false) {
                    console.log('false')
                    suggestions = Object.values(snapshot.val())
                    console.log(suggestions,'ddd');
                }

                for (var i = 0; i < suggestions.length; i++) {
                    if (suggestions[i] && suggestions[i].title === suggested) {
                        suggestions.splice(i, 1);
                        console.log(' removed ' + suggested, suggestions)
                        break;
                    }

                }
                 firebase.database().ref(`users/${uid}/suggestions`).set(suggestions)
            }

        });

    }
