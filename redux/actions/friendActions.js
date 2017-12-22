import {
    UPDATE_QUERY
} from './action-types'
import firebase from 'firebase';

export const updateQuery= (email, dispatch) =>
  dispatch => dispatch({
    type: UPDATE_QUERY,
    payload: email
  })

export const saveToDB = (fiendEmail, userID) =>
        firebase.database().ref(`users/${userID}/friends`).once('value', (snapshot) => {
            if (snapshot.val()){
                const savedEmails = Object.values(snapshot.val());
                let hasEmail=false;
                 for (var i=0; i<savedEmails.length; i++){//checking if friend email has previously been saved
                    if (savedEmails[i].email === fiendEmail){
                        hasEmail=true;
                    };
                }//if the email has been saved befefore, dont save
                hasEmail ? console.log('already saved') : firebase.database().ref(`users/${userID}/`).child('friends').set([...savedEmails, {email:fiendEmail}]);
            }
            else{
                firebase.database().ref(`users/${userID}/`).child('friends').set([{email:fiendEmail}])
            }
        });

export const saveEmail = (fiendEmail, userID, dispatch) =>
    dispatch => {
        firebase.database().ref(`users`).orderByChild('email').equalTo(fiendEmail).once('value', (snapshot)=>{
                var foundUser = snapshot.val();//entire user object
                var id = null;
                for (var key in foundUser) {
                    if (foundUser.hasOwnProperty(key)) //looking for userID/key
                        { id = key; }
                }
                if (id){//if email exists save friend email to db
                    console.log("email exists!")
                    saveToDB(fiendEmail, userID, dispatch);
                }
                else{
                    console.log("email does not exist!")
                }
            })
}