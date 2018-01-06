import React, { Component } from 'react';
import { View, Text , Picker, ScrollView} from 'react-native';
import { Header, Card, CardSection, Button, Input } from './common';
import { updateQuery,
  searchFriend, saveFriend,
  deleteFriend, upDateDisplay,
getUserFriends} from '../redux/actions/friendActions';
import {getSavedBooks} from '../redux/actions/bookActions';
import { connect } from 'react-redux';
import   firebase from 'firebase';
import { Actions} from 'react-native-router-flux';
import {Spinner} from './common'
class Friends extends Component {

   // state = { friendId: null }

  // componentDidMount() {
  //   this.props.clearBooks()


  // }

    componentWillUnmount(){
        this.props.upDateDisplay(false); //removes the display component when user leaves the page
        this.props.updateQuery('');//clears the email input bar when user leaves the page
        //this.props.clear()
    }

    onEmailChange(email) {
        console.log('email', email);
        this.props.updateQuery(email);
        this.props.upDateDisplay(false);
    }

    handleSearch=()=>{
        const { searchFriend, friends, auth } = this.props;
        searchFriend(friends.email, auth.userId); //search for email input in db
    }
    handleAdd=()=>{
        const { saveFriend, friends, auth } = this.props;
        saveFriend(friends.email, auth.userId);
    }
    handleDelete=()=>{//auth.userId = current user id
         const { deleteFriend, friends, auth } = this.props;
         deleteFriend(friends.email, auth.userId)
    }

    //displaying search results logic, order of function calls are in parenthesis

    renderFriendStatus=()=>{//if the email has previously been saved display "un-friend", if email is new display "add frend" (3)
        return (this.props.friends.friendStatus ? <Button onPress={()=>this.handleDelete()}> un-friend </Button> : <Button onPress={()=>this.handleAdd()}> add friend </Button>)
    }
    renderSearchResults=()=>{//if the email has not been registered in the bookApp  display "user email not found" (2)
        return (this.props.friends.found ? this.renderFriendStatus() : <Text> user email not found </Text>)
    }
    renderSearchDisplay=()=>{//hide display if there no search results available (1)
        return (this.props.friends.display ? this.renderSearchResults() : null)
    }






    displayUser(){
      const {friends} = this.props
      if (friends.found){
        return (<Text onPress={() =>
         Actions.profile({user: this.props.book.user})}>{friends.email}</Text>)
      }
      return null
    }

    onSeeFriends(){
      this.props.getUserFriends(this.props.auth.userId)
    }

    getUserBooks(email){
     firebase.database().ref(`users`).orderByChild('email').equalTo(email).once('value', (snapshot)=>{
                 if (snapshot.val())
                   { var Id = Object.keys(snapshot.val())[0];
                    this.props.getSavedBooks(Id)
                    Actions.profile({user: this.props.book.user})
                    console.log(Id, 'snapshot val')}
     })
    }

  render() {
    {console.log(this.props,' jessica')}
    const { loggedIn } = this.props.auth;
    const { friendStatus } = this.props.friends;
    return (
       <ScrollView style={styles.container}>
         <Header headerText="Friends" />
           <Card>
           <CardSection>
              <Input
              placeholder="email"
              label="email"
              onChangeText={this.onEmailChange.bind(this)}
              value={this.props.friends.email}
            />
          </CardSection>
           <CardSection>
            <Button onPress={()=> this.handleSearch()} > Search </Button>
          </CardSection>
          <CardSection>
            { this.renderSearchDisplay() }
          </CardSection>

          <CardSection>
            { this.displayUser() }
          </CardSection>

          <CardSection>
          <Button onPress={() => this.onSeeFriends()}>See All friends</Button>

          </CardSection>
          {this.props.friends && this.props.friends.userFriends?

            this.props.friends.userFriends.map((users, index) =>{
              return (<Text key={index} onPress={() => this.getUserBooks(users.email)}>{users.email}</Text>)
            })
     :  null }

           </Card>
      </ScrollView>
    )
  }
}

styles = {
  container: {
    flex: 1,
    paddingHorizontal: 10
  }
}

export default connect(
    ({ auth, friends, book }) => ({auth: auth, friends: friends, book: book}),
    {
      updateQuery,
      searchFriend,
      saveFriend,
      deleteFriend,
      upDateDisplay,
      getUserFriends,
      getSavedBooks,

    },
  )(Friends)
