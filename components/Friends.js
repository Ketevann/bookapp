import React, { Component } from 'react';
import { View, Text , Picker, ScrollView, FlatList, Image, StyleSheet, TouchableHighlight, Animated} from 'react-native';
import { Header, Card, CardSection, Button, Input } from './common';
import { updateQuery,
  searchFriend, saveFriend,
  deleteFriend, upDateDisplay,updateFriends,
getUserFriends} from '../redux/actions/friendActions';
import {getSavedBooks} from '../redux/actions/bookActions';
import { connect } from 'react-redux';
import   firebase from 'firebase';
import { Actions} from 'react-native-router-flux';
import {Spinner} from './common'
import AnimatedFlick from './AnimatedFlick'

const ANIMATION_DURATION = 500;

class Friends extends Component {
  constructor(props) {
    super(props);
   this._animated = new Animated.Value(1);
  }
 
    componentWillUnmount(){
        this.props.upDateDisplay(false); //removes the display component when user leaves the page
        this.props.updateQuery('');//clears the email input bar when user leaves the page
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

    handleRemove(index){
        Animated.timing(this._animated, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start(this.onRemove.bind(this,index));
      
      };

    onRemove(index){
        const { updateFriends, auth } = this.props;
        const friends = this.props.friends.userFriends;
              start = friends.slice(0, index),
              end = friends.slice(index + 1),
        updateFriends( auth.userId, start.concat(end));
    };



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

renderRow(friend){
  return (
    <AnimatedFlick>
      <View>
        <View style={ styles.listContainer}>
          <Image style={styles.listAvatar}
                source={{ uri:friend.item.avatar === null || friend.item.avatar === undefined ? 'https://via.placeholder.com/70x70.jpg' : friend.item.avatar }}
          />
          <Text style={styles.listText} onPress={this.getUserBooks.bind(this, friend.item.email)}>{friend.item.email}</Text>  
        </View> 
        <View style={styles.cellBorder} />
      </View>
      <TouchableHighlight 
        onPress={this.handleRemove.bind(this,friend.index)} 
        style={ { justifyContent: 'center', alignItems: 'center' ,width: 90, height:100, backgroundColor:"yellow" }}>
          <Text style={{  textAlign: 'center',}} >Delete</Text>
      </TouchableHighlight>
    </AnimatedFlick>
  );
}
renderSeparator(){
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };


  render() {
    {console.log(this.props,' jessica')}
    const { loggedIn } = this.props.auth;
    const { friendStatus } = this.props.friends;
    return (
       <ScrollView >
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
          <FlatList
              data={this.props.friends.userFriends}
              extraData={this.state}
              renderItem={this.renderRow.bind(this)}
              ItemSeparatorComponent={this.renderSeparator.bind(this)}
              keyExtractor={(item, index) => index}
              />
           </Card>
      </ScrollView>
    )
  }
}

 const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'white',
    height:70,
    width:380
  },
  listText: {
    marginLeft: 12,
    fontSize: 16,
  },
  listAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});
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
      updateFriends

    },
  )(Friends)
