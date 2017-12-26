import {
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES,
    UPDATE_SUGGESTIONS,
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



export const hasSuggestions =(bool, dispatch) =>
    dispatch=>dispatch({
        type:HAS_SUGGESTIONS,
        payload:bool
    })



export const updatePreferences = (newPrefs, userID, dispatch) =>
    dispatch => {
        console.log('UPDATE ALL PREFERENCES FireBase', newPrefs);
        firebase.database().ref(`users/${userID}/`).child('preferences').once('value', (snapshot) => {
            if (snapshot.val()){
                let currentPrefs=snapshot.val();
                // console.log('CurrentPrefs', currentPrefs);
                // console.log('NewPrefs', newPrefs);
                
                 if(currentPrefs.title!==newPrefs.title && newPrefs.title!==""){
                    currentPrefs.title=newPrefs.title;
                    console.log("title",'CurrentPrefs', currentPrefs);
                    firebase.database().ref(`users/${userID}/`).child(`preferences`).set( currentPrefs)
                         
                }
                if(currentPrefs.author!==newPrefs.author && newPrefs.author!==""){
                    currentPrefs.author=newPrefs.author
                    console.log('author','CurrentPrefs', currentPrefs);
                    firebase.database().ref(`users/${userID}/`).child(`preferences`).set(currentPrefs)
                }
                firebase.database().ref(`users/${userID}/`).child('suggestions').set(null);             
                findSimilar(currentPrefs.author,'author',userID,dispatch); 
                findSimilar(currentPrefs.title,'title',userID,dispatch); 
                //displaySuggestions(userID,dispatch);
                //Actions.home();
               
            }
            else {
                    console.log('no prefs, starting new branch');
                    firebase.database().ref(`users/${userID}/`).child(`preferences`).set(newPrefs)
                        findSimilar(newPrefs.author,'author',userID,dispatch); 
                        findSimilar(newPrefs.title,'title',userID,dispatch); 
                
            }
        });
    }


export const displaySuggestions =(userID,dispatch)=>{
     firebase.database().ref(`users/${userID}/suggestions`).once('value', (snapshot) => {
                const savedSuggestions = snapshot.val();
                dispatch({ type: HAS_SUGGESTIONS, payload: savedSuggestions })
                        });
     }

export const saveSuggestions = (books, userID, dispatch) => {                   
              firebase.database().ref(`users/${userID}/suggestions`).once('value', (snapshot) => {
                    if (snapshot.val()){
                        const savedSuggestions = Object.values(snapshot.val());
                        firebase.database().ref(`users/${userID}/`).child('suggestions').set([...savedSuggestions,...books]);  
                    }else{
                        console.log('34');
                        firebase.database().ref(`users/${userID}/`).child('suggestions').set([...books]);  
                    }
                });                                                 
}

export const getBooksFromApi = (books, userID, dispatch) => {
    const bookPromises = books.map((book) => 
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
        axios.all(bookPromises)
            .then(axios.spread((...args) => {
                //collect returned data for each api call in array
                const bookList = args.map((book) => {
                    console.log(book.data.items[0].volumeInfo.title, "title");
                    return book.data.items[0].volumeInfo;
                })
                return saveSuggestions(bookList,userID, dispatch)
            })).catch((error) => {
                console.error(error);
            });
    }


export const getDefualt = dispatch => dispatch => getBooksData(defaultBooks.list, dispatch);//send default books to google api

export const clearBooks = (dispatch) =>dispatch=> {return  dispatch({ type: CLEAR_BOOKS})};//clears preferences books array 

export const findSimilar = (keyword, type, userID, dispatch) => {
    console.log('findSimilar',keyword,type)
    let mediaType = null;
        type === 'title' ? mediaType='book' : mediaType = 'author';
        axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${mediaType}s`)
            .then(res => getBooksFromApi(res.data.Similar.Results, userID, dispatch))
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


export const loadPrefBooks= (userID, dispatch)=> {
    firebase.database().ref(`users/${userID}/`).child('preferences').once('value', (snapshot) => {
                  const preferences= snapshot.val();//this is the  preferences object
                   if (validate(preferences)){
                            preferences.title ? findSimilar(preferences.title, 'title',userID,  dispatch) : null;
                            preferences.author ? findSimilar(preferences.author, 'author',userID,  dispatch) : null;
                    }else {
                            console.log("no prefs, loading defualt suggestions"); 
                            getBooksFromApi(defaultBooks.list, userID, dispatch);
                    }    
            })
}


export const getSuggestions = ( userID,dispatch ) => dispatch => firebase.database().ref(`users/${userID}/suggestions`).once('value', (snapshot) => {
           if (snapshot.val()){
                const suggestions = Object.values(snapshot.val());
                dispatch({ type: UPDATE_SUGGESTIONS, payload: suggestions })
            }
            else{
                loadPrefBooks(userID, dispatch);
            }
    });




 