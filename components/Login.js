import React, { Component } from 'react';
import { Text, View ,   TextInput,
} from 'react-native';
import firebase from 'firebase';
import { Header, Button, Spinner } from './common';
import {LoginForm} from './common/LoginForm'
class App extends Component {
  
  state = { 
    loggedIn: null,
    users:[],
    userName:'',
  }

  componentWillMount() {
    // firebase.initializeApp({
    //   apiKey: 'AIzaSyBxQ6Lpnp0FT8Fvg8g8Ic7_w4PDJwnqmMo',
    //   authDomain: 'auth-a98f1.firebaseapp.com',
    //   databaseURL: 'https://auth-a98f1.firebaseio.com',
    //   projectId: 'auth-a98f1',
    //   storageBucket: 'auth-a98f1.appspot.com',
    //   messagingSenderId: '314366021514'
    // });

     firebase.initializeApp({
      apiKey: 'AIzaSyAQLrnXMUPqPkfS6IiYI2pqJ-ix0L5ifwI',
      authDomain: 'test23-8732c.firebaseapp.com',
      databaseURL: 'https://test23-8732c.firebaseio.com',
      projectId: 'test23-8732c',
      storageBucket: 'test23-8732c.appspot.com',
      messagingSenderId: '196992616531'
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
         console.log(firebase.auth().currentUser.uid);  
      }
      else this.setState({ loggedIn: false })
    })

    this.rootRef = firebase.database().ref();
    this.usersRef = this.rootRef.child('users');

    // this.messageRef = this.rootRef.child('messages');
    // this.users = this.rootRef.child('users');
  }

  //componentDidMount(){
    // this.usersRef.on('child_added', snapshot => {
    //   const updatedUsers = [...this.state.users];
    //   const newUser =this.state.userName;
    //   newUser.key = snapshot.key;
    //   updatedUsers.push(newUser)
    //   this.setState({
    //     users: updatedUsers,
    //   });


     
    // });
    // this.messageRef.on('child_added', snapshot => {
    //   const updatedMessages = [...this.state.messages];
    //   const newMessage = snapshot.val();
    //   newMessage.key = snapshot.key;
    //   updatedMessages.push(newMessage)
    //   this.setState({
    //     messages: updatedMessages,
    //   });
    // });

    // this.messageRef.on('child_removed', snapshot => {
    //   const updatedMessages = [...this.state.messages];
    //   for(let i=0; i < updatedMessages.length; i++){
    //     if(updatedMessages[i].key === snapshot.key){
    //       updatedMessages.splice(i,1)
    //       this.setState({
    //         messages: updatedMessages,
    //       })
    //     }
    //   }
    // });

  //}



  handleAddBooks=(object)=>{
      firebase.database().ref("users").orderByChild("FirebaseUserID").equalTo(firebase.auth().currentUser.uid).on("child_added", (snapshot)=>{
          firebase.database().ref().child('users').child(snapshot.key).push(object);
      })
  }

  handleAddUser=()=>{
    const date = new Date();
    console.log(this.state.users,"users");
    this.usersRef.push().set({
      timeStamp: date.toTimeString(),
      userName: this.state.userName,
      FirebaseUserID:firebase.auth().currentUser.uid,
    })
    this.setState({userName: ''})
  }

renderContent(){
    switch(this.state.loggedIn){
      case true:
       return (
          <View style={{height:150}}>
            <TextInput
              style={{height:50,backgroundColor:'white'}}
              placeholder="Tap to enter a message"
              ref={component => this._textInput = component}
              onChangeText={(text) => {this.setState({userName:text}); console.log(text) }}
              returnKeyType={'search'}
            />       
            <Button onPress={()=>this.handleAddUser()} > Add User </Button>
            <Button onPress={()=>this.handleAddBooks({ booksLiked:["books1", "book2s","books3"]} )}> Add Books </Button>
            
            <Button onPress={() => firebase.auth().signOut()}>Log Out</Button>
          </View>
       )
      case false: return  <LoginForm />
      default:
      return <Spinner size="small" />
    }


}
  render() {
    return (
      <View>
        <Header headerText="Authentication" />
       {this.renderContent()}
      </View>
    );
  }
}

export default App;
