import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  PanResponder

} from 'react-native';
import { Header, CardSection, Spinner,Button } from './common'
import { getSavedBooks,removeBooks,
markAsRead } from '../redux/actions/bookActions';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'firebase';
import axios from 'axios';
import Dimensions from 'Dimensions'
var {height, width} = Dimensions.get('window')
import { Card, Icon } from 'react-native-elements'

class SavedBooks extends Component {

  constructor(props){
    super()
    //const panResponder = PanResponder.create({

   // });
   // this.state = {panResponder}

  }
// componentWillMount() {



//   console.log(this.props.user, ' printing suer');
//   this.props.getSavedBooks(this.props.user)




//   }


onDelete(title){
  console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
  this.props.removeBooks(this.props.auth.userId, title)
}

onRead(title){
  console.log('76l4BsVra7MZrR7NzuPv6XRg5BP2', 'Pan', ' ****')
  this.props.markAsRead(this.props.auth.userId, title)
}

renderElemets(color){
  const {savedBooks} =  this.props.book
  console.log(' undered', this.props.book)
      if(this.props.book){

        return savedBooks.map((book,index)=>{

         return (

           <View>
          <Text>{book.title}</Text>

           <Image
          style={{height: 400, width: 250}}
          source={{uri: `https://ia800606.us.archive.org/zipview.php?zip=/18/items/olcovers645/olcovers645-L.zip&file=6453948-L.jpg`}}
        />
        {this.props.auth.userId === this.props.user ?
          <View>


<View
style={{flexDirection:'row', margin: 10}}
>
<Icon
  raised
  name='check'
  type='font-awesome'
  color={color}
  onPress={() => this.onRead(book.title)} />


<Icon
  raised
  name='delete'
  type='delete'
  color='#f50'
  onPress={() => this.onDelete(book.title)} />
</View>



         </View> : null}
         </View>)
    })
  }

  else return <Spinner size='large' />
}


  render() {
    let color
    {this.props.book && this.props.book.read === true ?
      color =  '#f50'
      :
      color = 'gray'
    }

    { console.log(this.props,  "preferences=======================================>") }


    return (
      <ScrollView>


    {this.renderElemets(color)}

      </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageStyle: {
    position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  }


});

export default connect(
  ({ auth, preferences,  book }) => ({ auth: auth, preferences: preferences,  book: book }),
  {

    getSavedBooks,
    removeBooks,
    markAsRead
  })(SavedBooks)
