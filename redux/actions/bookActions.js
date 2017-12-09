import { BOOK_SUGGESTIONS_DATA_RECIEVED } from './action-types'
import { GOOGLE_API_KEY } from '../../keys'
import   firebase from 'firebase';
import   axios from 'axios';


export const getBookSuggestions = (books, dispatch) =>
     dispatch => {
        //sends title in 'books' array to google api and collects promises in array
        const bookPromises = books.map((book) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
              axios.all(bookPromises)
                .then(axios.spread((...args) => {
                    //collect returned data for each api call in array
                    const bookList = args.map((book)=>{
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


export const createBookShelf= ( title, userID , dispatch) =>
    //start a new books branch
    dispatch => {
        firebase.database().ref(`users/${userID}/`).child('books').set([title])
    }

export const saveBook = ( title, userID, dispatch ) =>
    dispatch => firebase.database().ref(`users/${userID}/books`).once('value', (snapshot)=>{
                    const savedBook=Object.values(snapshot.val());
                    //db books are returned as an object, iterate object and save values (titles) in array
                     firebase.database().ref(`users/${userID}/`).child('books').set([... savedBook, title ]);
                    //add new book and reset books branch                  ( old books ^, new book ^ )
                });


