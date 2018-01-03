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

            })//*the glitch is here, since we send newPrefs to "find". if we only update one pref. the other isleft blank. and we over write suggestions, so we lose what was already there
            .catch(error => {
                console.log('no prefs, starting new branch');
                preferenceRef.set(newPrefs)
            })
            .then(() => {
                //we return a single array of titles to be sent to googleAPI
                return find(newPrefs);//calling TasteDive
            })
            .then ((titles)=>{
                //console.log(titles,"90909090909900==========9090909090============0990909090>")
                return  getBooksFromApi(titles)//calling googleAPI
            })
            .then((booksData)=>{
                  saveSuggestions(booksData, userID, dispatch)//saving
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
export const saveSuggestions = (books, userID, dispatch) => {
    // const suggestionsPref = firebase.database().ref(`users/${userID}/`).child('suggestions');
    // suggestionsPref.once('value')
    //     .then(snapshot => {//i dont think we append in this version of code, i think we can just, get rid of spread operator and throw/catch, that part was for appending.
    //         if (!snapshot.val())
    //             throw ("Error")
                
    //         const savedSuggestions = Object.values(snapshot.val());
    //         suggestionsPref.set([...savedSuggestions, ...books]);
    //         dispatch({ type: UPDATE_SUGGESTIONS, payload: savedSuggestions })
    //     })
    //     .catch(error => {
    //         console.log('34');
    //         suggestionsPref.set([...books]);
    //         dispatch({ type: UPDATE_SUGGESTIONS, payload: books });
    //     })
    //     .then(()=>Actions.home());//instead of calling "display" we just redirect to home. 
    
    //i dont think we append in this version of code, i think we can just, get rid of spread operator and throw/catch, that part was for appending.
     const suggestionsPref = firebase.database().ref(`users/${userID}/`).child('suggestions');
        suggestionsPref.set([...books])
        .then(()=>{
            dispatch({ type: UPDATE_SUGGESTIONS, payload: books });
        })
        .then(()=>Actions.home());//instead of calling "display" we just redirect to home. 
}

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
    let titlePromises = Object.keys(preferences).map(keyword => {
                            console.log(keyword, 'keyword')
                            if (preferences[keyword] !== '') {
                                console.log(preferences[keyword], 'check check')
                                return axios.get(`https://tastedive.com/api/similar?q=${preferences[keyword]}&k=${TASTE_DIVE_API_KEY}&limit=2&type=${keyword}`)
                            }
                        })

    let titlePromises2 = titlePromises.filter(x => x);//removing undefined if any. cuz if we only update a title or a an author we get undefined for the other.even if that other pref
    //already exists in db. its a glitch :D, once we fix glitch we can get rid of filter. 
    //we return a single array of all titles to be sent to googleAPI     
    return axios.all(titlePromises2)
            .then((similarTitles)=>{
                var titles=[];
                // axios.all(promises) returned to us an array of objects, within object, there is a nested array -> object.data.Similar.Results, 
                //which contains book titles, we push individual titles to "titles"
                similarTitles.forEach((book)=>{
                    book.data.Similar.Results.forEach((book)=>
                        titles.push(book))
                })
                return titles
            }).catch((error) => {
                console.error(error);
            });        
}


export const loadPrefBooks = (userID, dispatch) => {// we dont need to call a display function
    firebase.database().ref(`users/${userID}/`).child('preferences').once('value')
    .then(snapshot => {
        const preferences = snapshot.val();//this is the  preferences object
        if (!snapshot.val())
            throw ("Error")
                    
        return find(preferences);//calling TasteDive
        //we return an array of titles to be sent to googleAPI
    })
    .then ((titles)=>{
        return  getBooksFromApi(titles)//calling googleAPI
    })
    .then((booksData)=>{
        saveSuggestions(booksData, userID, dispatch)//saving
    })  
    .catch(error => {
        console.log("no prefs, loading defualt suggestions"); 
        //we have a defualt branch in firebase, 
        firebase.database().ref(`default`).once('value', (snapshot) => {
                const defaultBooks=snapshot.val();
                firebase.database().ref(`users/${userID}/`).child('suggestions').set([...defaultBooks]);//setting defualt books to suggestions branch  
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
