import {
    UPDATE_TITLE,
    UPDATE_AUTHOR,
    UPDATE_GENRE,
    UPDATE_PREFERENCES,
    UPDATE_PREFERENCE_TYPE,
    UPDATE_PREFERENCE_KEYWORD,
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


// export const updateTitle = (title, dispatch) =>
//     //console.log('UPDATE TITLE',title);
//     dispatch => dispatch({
//         type: UPDATE_TITLE,
//         payload: title
//     })

// export const updateAuthor = (author, dispatch) =>
//     //console.log('UPDATE AUTHOR',author);
//     dispatch => dispatch({
//         type: UPDATE_AUTHOR,
//         payload: author
//     })



// export const hasSuggestions = (bool) =>
//     ({
//         type: HAS_SUGGESTIONS,
//         payload: bool
//     })

export const updatePrefType = (preference) => {
  return {
    type: UPDATE_PREFERENCE_TYPE,
    payload: preference
  }
}

export const updatePrefTypeDispatch = (preference) => {
  return dispatch =>
    dispatch(updatePrefType(preference))
}

export const updateKeyWord= (keyWord) => {
  return {
    type: UPDATE_PREFERENCE_KEYWORD,
    payload: keyWord
  }
}

export const keyWordDispatch = (keyWord) => {
  return dispatch =>
    dispatch(updateKeyWord(keyWord))
}


export const updatePreferences = (newPrefs, userID, dispatch) =>
    dispatch => {
        console.log('UPDATE ALL PREFERENCES FireBase', newPrefs);
        //preferences firebase reference
    
        //console.log(newPrefs,"90909090909900==========9090909090============0990909090>")
        const preferenceRef = firebase.database().ref(`users/${userID}/`).child('preferences');
        const suggestionsRef = firebase.database().ref(`users/${userID}/suggestions`);

        preferenceRef.once('value')
            .then(snapshot => {
                //  if (newPrefs.title !== "" || newPrefs.author !== "")
                //     {   console.log('NULLLL')
                //         suggestionsRef.set(null);}
                // if (!snapshot.val())
                //     throw ("Error")

                // let currentPrefs = snapshot.val();

                // if (currentPrefs.title !== newPrefs.title && newPrefs.title !== "") {
                //     preferenceRef.update({ title: newPrefs.title })

                // }
                // if (currentPrefs.author !== newPrefs.author && newPrefs.author !== "") {
                //     preferenceRef.update({ author: newPrefs.author })
                // }
                

                if (!snapshot.val())
                    throw ("Error")
               
                let currentPrefType=Object.keys(snapshot.val())[0],
                    currentPrefValue=Object.values(snapshot.val())[0],
                    newPrefType=Object.keys(newPrefs)[0],
                    newPrefValue=Object.values(newPrefs)[0];
             
                    //input validation should be done before submitting?
                if (currentPrefValue!== newPrefValue && newPrefValue !== "" && newPrefType!==null) {
                    suggestionsRef.set(null);
                    preferenceRef.set(null);
                    preferenceRef.update(newPrefs)
                }

            })
            .catch(error => {
                console.log('no prefs, starting new branch');
                alert('r')
                preferenceRef.set(newPrefs)
            })
            .then(() => {
                //we return a single array of titles to be sent to googleAPI
                return find(newPrefs);//calling TasteDive
            })
            .then ((similarTitles)=>{
                //console.log(titles,"90909090909900==========9090909090============0990909090>")
                return  getBooksFromApi(similarTitles.data.Similar.Results)//calling googleAPI
            })
            .then((booksData)=>{
                  //saveSuggestions(booksData, userID, dispatch)//saving
                   suggestionsRef.set([...booksData]);
                   dispatch({ type: UPDATE_SUGGESTIONS, payload: booksData });
            })
    }


// export const displaySuggestions = (userID, dispatch) => {
//     console.log('display Suggestions *** nnnnn')

//         console.log('kkk')
//         // firebase.database().ref(`users/${userID}/suggestions`).once('value', (snapshot) => {
//         //     console.log('display Suggestions ***', snapshot.val())
//         //     const savedSuggestions = snapshot.val();
//         //     dispatch(hasSuggestions(savedSuggestions))
//         // });

// }
// export const saveSuggestions = (books, userID, dispatch) => {
//     // const suggestionsPref = firebase.database().ref(`users/${userID}/`).child('suggestions');
//     // suggestionsPref.once('value')
//     //     .then(snapshot => {//i dont think we append in this version of code, i think we can just, get rid of spread operator and throw/catch, that part was for appending.
//     //         if (!snapshot.val())
//     //             throw ("Error")
                
//     //         const savedSuggestions = Object.values(snapshot.val());
//     //         suggestionsPref.set([...savedSuggestions, ...books]);
//     //         dispatch({ type: UPDATE_SUGGESTIONS, payload: savedSuggestions })
//     //     })
//     //     .catch(error => {
//     //         console.log('34');
//     //         suggestionsPref.set([...books]);
//     //         dispatch({ type: UPDATE_SUGGESTIONS, payload: books });
//     //     })
//     //     .then(()=>Actions.home());//instead of calling "display" we just redirect to home. 
    
//     //i dont think we append in this version of code, i think we can just, get rid of spread operator and throw/catch, that part was for appending.
//      const suggestionsPref = firebase.database().ref(`users/${userID}/`).child('suggestions');
//         suggestionsPref.set([...books])
//         .then(()=>{
//             dispatch({ type: UPDATE_SUGGESTIONS, payload: books });
//         })
//         .then(()=>Actions.home());//instead of calling "display" we just redirect to home. 
// }

export const getBooksFromApi = (books) => {//we get an array of titles and return an array of book data
    const bookPromises = books.map((book) => axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.Name}&key=${GOOGLE_API_KEY}`));
    //bookPromises is an array of unresolved promises
    return axios.all(bookPromises)
            .then(axios.spread((...args) => {
                //axios.spread((...args) returns an array of resolved promises, meaning an array of book objects
                //we map through the array and pick out only the data we need, we return an array of book data 
                return args.map((book) => {
                    return {
                        title:book.data.items[0].volumeInfo.title,
                        author: book.data.items[0].volumeInfo.authors[0],
                        imageLinks:book.data.items[0].volumeInfo.imageLinks ? book.data.items[0].volumeInfo.imageLinks: null,//we have ternary cuz some books dont have image/descrition
                        description: book.data.items[0].volumeInfo.description ? book.data.items[0].volumeInfo.description: null//without ternary, code crashes. unresolved promise error
                    }
                })
            }))
            .catch((error) => {
                console.error(error);
            });
}

export const find = (preferences) => {//we get an object of preferences and return an array of titles
    //console.log(Object.keys(preferences), 'alala', preferences)
    //using map so that we can collect unresolved promises in an arrary 
    // let titlePromise = Object.keys(preferences).map(keyword => {
    //                         console.log(keyword, 'keyword')
    //                         //if (preferences[keyword] !== '') {
    //                             console.log(preferences[keyword], 'check check')
    //                             return axios.get(`https://tastedive.com/api/similar?q=${preferences[keyword]}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${keyword}`)
    //                         //}
    //                     })
     

    //we return a promise that resolves into an array of all titles to be sent to googleAPI
    let type=Object.keys(preferences)[0];     
    return axios.get(`https://tastedive.com/api/similar?q=${preferences[type]}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${type}`);
            // .then((similarTitles)=>{
            //     return similarTitles.data.Similar.Results;
            // }).catch((error) => {
            //     console.error(error);
            // });        
}


export const loadPrefBooks = (userID, dispatch) => {// we dont need to call a display function
  const suggestionsRef = firebase.database().ref(`users/${userID}/suggestions`);
        firebase.database().ref(`users/${userID}/`).child('preferences').once('value')
        .then(snapshot => {
            const preferences = snapshot.val();//this is the  preferences object
            if (!snapshot.val())
                throw ("Error")
                        
            return find(preferences);//calling TasteDive
            //we return a promise that resolves into array of titles to be sent to googleAPI
        })
        .then ((similarTitles)=>{
            return  getBooksFromApi(similarTitles.data.Similar.Results)//calling googleAPI
        })
        .then((booksData)=>{
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





export const getSuggestions = (userID, dispatch) =>//we call this function in componentWillMount, so we dont need to call a display function
    dispatch =>
        firebase.database().ref(`users/${userID}/suggestions`).once('value')//if there are suggestions we load those to state
            .then(function (snapshot) {
                if (!snapshot.val())
                    throw ("Error")
                
                const suggestions = Object.values(snapshot.val());
                dispatch({ type: UPDATE_SUGGESTIONS, payload: suggestions })
            })
            .catch((error) => loadPrefBooks(userID, dispatch))//else check for preferences, if none, load default
