import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { Button} from './common';
import firebase from 'firebase';
import { loginDispatch, loginDispatchFalse } from '../redux/actions/authActions'
import { connect } from 'react-redux';


class Book extends Component {
    componentWillMount(){
      firebase.auth().onAuthStateChanged((user) => {
          console.log((this.props, ' in authfirebase', user))
          if (user) {
            this.props.loginDispatch(user.uid)
          }
          else this.props.loginDispatchFalse()
        })
      }
  
handleAddBooks=(book)=>{
   const {userUID } = this.props.auth;
      //  alert(userUID)
       firebase.database().ref("users").orderByChild("FirebaseUserID").equalTo(userUID).on("child_added", (snapshot)=>{
           firebase.database().ref().child('users').child(snapshot.key).push(book);
        // firebase.auth().currentUser.uid
       })
   }

  render() {
    const { imageLinks, title } = this.props.book;
    const  { loggedIn , userUID } = this.props.auth;
    return (
     <TouchableOpacity style={styles.container} >
          {/*<View style={styles.imageContainer}>
            <Image  source={ {uri: imageLinks.thumbnail}} style={styles.image} />
          </View>*/}
          { loggedIn ?  <Button onPress={()=>this.handleAddBooks({ booksLiked:[title]} )}> Save Book </Button> : <Text>sign in to save</Text>}
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
     </TouchableOpacity>
     
    );
  }
}



const styles = StyleSheet.create({
  container:{
    backgroundColor: '#f8f8ff',
    // marginTop:20,
    // paddingRight:20,
    // paddingLeft:20,
    // paddingBottom:20
    height:50,
    display:'flex'
  },
  image: {
    flex:1,
    width: 66, 
    height: 58             
  }
});


export default connect(({ auth }) => ({ auth: auth }), { loginDispatch, loginDispatchFalse })(Book)
