import {
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES,
    UPDATE_SUGGESTIONS,
    HAS_SUGGESTIONS
} from './action-types'
import firebase from 'firebase';
import axios from 'axios';
import { TASTE_DIVE_API_KEY } from '../../keys'
import { GOOGLE_API_KEY } from '../../keys'
import defaultBooks from '../../components/data/defaultBooks';
import { Actions } from 'react-native-router-flux';
import store from '../../store'


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



export const hasSuggestions = (bool) =>
    ({
        type: HAS_SUGGESTIONS,
        payload: bool
    })



export const updatePreferences = (newPrefs, userID, dispatch) =>
    dispatch => {
        console.log('UPDATE ALL PREFERENCES FireBase', newPrefs);
        //preferences firebase reference
        const preferenceRef = firebase.database().ref(`users/${userID}/`).child('preferences');
        const suggestionsRef = firebase.database().ref(`users/${userID}/suggestions`);

        preferenceRef.once('value')
            .then(snapshot => {
                 if (newPrefs.title !== "" || newPrefs.author !== "")
                    {   console.log('NULLLL')
                        suggestionsRef.set(null);}
                if (!snapshot.val())
                    throw ("Error")

                let currentPrefs = snapshot.val();

                if (currentPrefs.title !== newPrefs.title && newPrefs.title !== "") {
                    preferenceRef.update({ title: newPrefs.title })

                }
                if (currentPrefs.author !== newPrefs.author && newPrefs.author !== "") {
                    preferenceRef.update({ author: newPrefs.author })
                }

                console.log('display Suggestions ***')

            })
            .catch(error => {
                console.log('no prefs, starting new branch');
                preferenceRef.set(newPrefs)
            })
            .then(() => {
                //here we keep getting an array of promises, so promise.all fixes that  
                 const promises=find(newPrefs, userID, dispatch);
                        return Promise.all(promises)
            }).then((res)=>{
                //console.log( res, "------------------------->Origin")
                //res here is an array of arrays. each child array has books data
                    res.forEach((book)=>{
                        if (book){//if the array child exists (cuz we get a "undefined" if there was no preference for that "keyword")
                                saveSuggestions(book, userID, dispatch)
                            }
                    })
            })
    }


export const displaySuggestions = (userID, dispatch) => {
    console.log('display Suggestions *** nnnnn')

        console.log('kkk')
        // firebase.database().ref(`users/${userID}/suggestions`).once('value', (snapshot) => {
        //     console.log('display Suggestions ***', snapshot.val())
        //     const savedSuggestions = snapshot.val();
        //     dispatch(hasSuggestions(savedSuggestions))
        // });

}
export const saveSuggestions = (books, userID, dispatch) => {
    const suggestionsPref = firebase.database().ref(`users/${userID}/`).child('suggestions');
    suggestionsPref.once('value')
        .then(snapshot => {
            if (!snapshot.val())
                throw ("Error")
            const savedSuggestions = Object.values(snapshot.val());
            suggestionsPref.set([...savedSuggestions, ...books]);
            dispatch({ type: UPDATE_SUGGESTIONS, payload: savedSuggestions })
        })
        .catch(error => {
            console.log('34');
            suggestionsPref.set([...books]);
            dispatch({ type: UPDATE_SUGGESTIONS, payload: books });
        })
       //.then(()=> dispatch({ type: UPDATE_SUGGESTIONS, payload: savedSuggestions }))

}

export const getBooksFromApi = (books, userID, dispatch) => {
    const bookPromises = books.map((book) =>
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
        return axios.all(bookPromises)
            .then(axios.spread((...args) => {
                //collect returned data for each api call in array
                return args.map((book) => {
                       //return book.data.items[0].volumeInfo;
                       //returning only the data we need
                    return {
                                title:book.data.items[0].volumeInfo.title,
                                author: book.data.items[0].volumeInfo.authors[0],
                                imageLinks:book.data.items[0].volumeInfo.imageLinks ? book.data.items[0].volumeInfo.imageLinks: null,
                                description: book.data.items[0].volumeInfo.description ? book.data.items[0].volumeInfo.description: null
                             }
                })
            
            }))
            .catch((error) => {
                console.error(error);
            });
}


export const getDefualt = dispatch =>
    dispatch =>
        getBooksFromApi(defaultBooks.list, dispatch);//send default books to google api

export const clearBooks = (dispatch) =>
    dispatch => dispatch({ type: CLEAR_BOOKS });//clears preferences books array

// export const findSimilar = (keyword, type, userID, dispatch) => {
//    /* Object.keys(preferences).forEach(keyword =>{
//        if (keyword !== '' ){
//            axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${keyword}s`)
//         .then(res => getBooksFromApi(res.data.Similar.Results, userID, dispatch))
//         .catch((error) => {
//             console.error(error);
//         });

//        }
//    })
//    */


//     console.log('findSimilar', keyword, type)
//     let mediaType = null;
//     type === 'title' ? mediaType = 'book' : mediaType = 'author';
//     axios.get(`https://tastedive.com/api/similar?q=${keyword}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${mediaType}s`)
//         .then(res => getBooksFromApi(res.data.Similar.Results, userID, dispatch))
//         .catch((error) => {
//             console.error(error);
//         });
// }


export const find = (preferences, userID, dispatch) => {
    console.log(Object.keys(preferences), 'alala', preferences)
    //using map so that we can collect and group all promises in an arraryto be returned to origin (origin is the function that started the chain of function calls) 
    //map returns an array
    return Object.keys(preferences).map(keyword => {
        console.log(keyword, 'keyword')
        if (preferences[keyword] !== '') {
            console.log(preferences[keyword], 'check check')
            return axios.get(`https://tastedive.com/api/similar?q=${preferences[keyword]}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${keyword}`)
                .then(res => {
                    console.log(res, ' res!!!')
                    return  getBooksFromApi(res.data.Similar.Results, userID, dispatch)
                })
                .catch((error) => {
                    console.error(error);
                });
                    }
    })
}

export const validate = (preferences) => {
    if (preferences) {
        //turns object values into array, then filters for non-empty, returns 0 if (object exists but is empty ) or a value
        return Object.values(preferences).filter(preference => preference !== "").length;
    } else return null //return null if no preferences object exists
}


export const loadPrefBooks = (userID, dispatch) => {
    console.log('load pred')
    firebase.database().ref(`users/${userID}/`).child('preferences').once('value')
     .then(snapshot => {
        const preferences = snapshot.val();//this is the  preferences object
        if (validate(preferences)) {
            //find user's preferences
            return find(preferences, userID, dispatch)

        } else {
            console.log("no prefs, loading defualt suggestions");
            return getBooksFromApi(defaultBooks.list, userID, dispatch);
        }
    })
}





export const getSuggestions = (userID, dispatch) =>
    dispatch =>
        firebase.database().ref(`users/${userID}/suggestions`).once('value')
            .then(function (snapshot) {
                if (!snapshot.val())
                    throw ("Error")
                const suggestions = Object.values(snapshot.val());
                dispatch({ type: UPDATE_SUGGESTIONS, payload: suggestions })
               // displaySuggestions(userID, dispatch)
            })
            .catch((error) => {
                loadPrefBooks(userID, dispatch)

            //.then( displaySuggestions(userID, dispatch))
//                // displaySuggestions(userID, dispatch)
//                Promise.all([loadPrefBooks]).then(values => {
//   console.log(values, 'val, va'); // [3, 1337, "foo"]

})

// .then(() => displaySuggestions(userID, dispatch))
// })
            // })
            //  .then(() => {


            //      return displaySuggestions(userID, dispatch)})

// load pred
// preferencesActions.js:84 display Suggestions *** nnnnn
// preferencesActions.js:195 no prefs, loading defualt suggestions
// preferencesActions.js:103 34

// ref.child('blogposts').child(id).once('value')

// .then(function(snapshot) {
//   // The Promise was "fulfilled" (it succeeded).
//   renderBlog(snapshot.val());
// }, function(error) {
//   // The Promise was rejected.
//   console.error(error);
// });
