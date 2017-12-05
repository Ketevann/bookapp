import { 
    LOAD_DEFAULT_BOOKLIST_DATA, GET_BOOKLIST_DATA_RECIEVED, DEFAULT_BOOKLIST_DATA_RECIEVED, SAVE_BOOK
} from './action-types'

import firebase from 'firebase';


export const getBookList = (title) => {
  console.log("getBookListDataRedux",title);
  return {
    type: GET_BOOKLIST_DATA,
    payload:title
  };
};



export const loadDefaultBookList = (bookList) => {
  console.log("loadDefaultBookListData",bookList);
  return {
    type: LOAD_DEFAULT_BOOKLIST_DATA,
    payload:bookList
  };
};



export const saveBook = ( title ) => {
        return (dispatch)=>{
            firebase.auth().onAuthStateChanged((user)=> {
                if (user) {
                    // alert(user.uid)
                    //User is signed in.
                    firebase.database().ref("users").orderByChild("FirebaseUserID").equalTo(user.uid).on("child_added", (snapshot)=>{
                            firebase.database().ref().child('users').child(snapshot.key).push({ booksLiked: title});
                    })
                    return (dispatch)=>{
                        dispatch({type: BOOK_SAVED_SUCESSFULLY })
                    }
                } else {
                    // No user is signed in.
                    return (dispatch)=>{
                        dispatch({type: BOOK_SAVED_SUCESSFULLY })
                    }
                }
            });
    }
}



