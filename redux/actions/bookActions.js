import { 
    LOAD_DEFAULT_BOOKLIST_DATA, GET_BOOKLIST_DATA_RECIEVED, DEFAULT_BOOKLIST_DATA_RECIEVED, SAVE_BOOK
} from './action-types'

import firebase from 'firebase';


export const getBookList = (title, dispatch) =>
    dispatch => dispatch({
                    type: GET_BOOKLIST_DATA,
                    payload:title
                });


export const loadDefaultBookList = (bookList, dispatch) => 
    dispatch => dispatch({
                    type: LOAD_DEFAULT_BOOKLIST_DATA,
                    payload:bookList
                });

/* Saving books*/ 
export const startNewSaveBookList = ( title, userID , dispatch) => 
    dispatch => {
        // alert('start a new list');
        firebase.database().ref(`users/${userID}/`).set({ books:[title]})
    }
      
export const appendSaveBookList = ( title, userID, dispatch ) => 
    dispatch => firebase.database().ref(`users/${userID}/books`).once('value', (snapshot)=>{
                    // alert(snapshot.val());
                    const savedBook=Object.values(snapshot.val());//get books already in db
                    firebase.database().ref(`users/${userID}/`).set({books:[... savedBook, title ]});//add new book and rest books branch
                    // console.log (savedBook, "------------->>>books")
                });


    
