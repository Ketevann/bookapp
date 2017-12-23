import {
    UPDATE_QUERY,
    UPDATE_FRIEND_STATUS,
    UPDATE_SEARCH_RESULT,
    UPDATE_DISPLAY
} from './action-types'
import firebase from 'firebase';

export const updateQuery= (email, dispatch) =>
  dispatch => dispatch({
    type: UPDATE_QUERY,
    payload: email
  })

export const isFriend= (bool, dispatch) =>
    dispatch => dispatch({
    type: UPDATE_FRIEND_STATUS,
    payload: bool
  })


export const emailExists= (bool, dispatch) =>
    dispatch => dispatch({
    type: UPDATE_SEARCH_RESULT,
    payload: bool
  })

export const upDateDisplay= (bool, dispatch) =>
    dispatch => dispatch({
    type: UPDATE_DISPLAY,
    payload: bool
  })


export const searchFriend = (friendEmail, currentUserID, dispatch) => 
    dispatch =>
        firebase.database().ref(`users`).orderByChild('email').equalTo(friendEmail).once('value', (snapshot)=>{
                    var foundUser = snapshot.val();
                    var id = null;
                    for (var key in foundUser) {
                        if (foundUser.hasOwnProperty(key)) //looking for userID/key
                            { id = key; }
                    }
                    if (id){// execute if email is registered in bookApp
                        console.log("email exists!")
                        checkDB(friendEmail, currentUserID, dispatch);//search for the email in the current user's friends
                        dispatch(emailExists(true, dispatch))//set the display to true, render results component
                       
                    }
                    else{// execute if email is not registered in bookApp
                        console.log("email does not exist!");
                        dispatch(emailExists(false, dispatch))//display "email does not exist"
                    
                    }
                    dispatch(upDateDisplay(true, dispatch))//set the display to true, render results component
        })

export const checkDB = (friendEmail, currentUserID, dispatch) =>
     dispatch =>
        firebase.database().ref(`users/${currentUserID}/friends`).once('value', (snapshot) => {
            if (snapshot.val()){
                const savedEmails = Object.values(snapshot.val());
                //checking if friend email has previously been saved
                for (var i=0; i<savedEmails.length; i++){
                    if (savedEmails[i].email === friendEmail){
                        console.log('user already saved in db');
                       return dispatch(isFriend(true, dispatch));//if email exists in friends branch, set friend statud in state to true, this renders an "un-friend" button
                    };
                     //if email is not in friends branch for this user, the defualt is false for friend status in state,this will render an "add friend" button
                }  
            }
            else{
                console.log('user not saved');
                //if no friends branch exist for this user, the defualt is false for friend status in state, this will render an "add friend" button
            }
        });

export const saveFriend = (friendEmail, currentUserID, dispatch) => 
    dispatch =>
        firebase.database().ref(`users/${currentUserID}/friends`).once('value', (snapshot) => {
            if (snapshot.val()){
                //if a friends branch exists, append email to friends
                const savedEmails = Object.values(snapshot.val());//saving current emails
                firebase.database().ref(`users/${currentUserID}/`).child('friends').set([...savedEmails, {email:friendEmail}]);//appending old emails and new email
            }
            else{
                //if a friends branch does not exist, start a friends branch andappend email 
                firebase.database().ref(`users/${currentUserID}/`).child('friends').set([{email:friendEmail}]);
            }
            dispatch(isFriend(true, dispatch));//update friend status in state to "true", this will render an "add friend" button
        });

export const deleteFriend = (friendEmail,currentUserID, dispatch) =>
    dispatch => {
        firebase.database().ref(`users/${currentUserID}/friends`).once('value', (snapshot) => {//on the friends branch for current user
            var index, savedEmails;
            if (snapshot.val()) {
               for (var i = 0; i < snapshot.val().length; i++) {//iterate though array of friend emails
                   if (snapshot.val()[i] && snapshot.val()[i].email === friendEmail) {//if email query matches, save the index
                        index = i;
                        firebase.database().ref(`users/${currentUserID}/friends/${index}`).set(null);//reset that index on friends branch to null, thus deleting friend email
                        dispatch(isFriend(false, dispatch));//update friend status in state to 'false', this will render an "add friend" button
                        break;
                   }
               }
            }
        });
    }