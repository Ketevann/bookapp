import   React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from './common';
import { connect } from 'react-redux';
import   firebase from 'firebase';
import { Card, Icon } from 'react-native-elements'


class Book extends Component {

  render() {

    const { imageLinks, title } = this.props.book,
          { loggedIn } = this.props.auth,
          {book} = this.props
        // console.log(this.props,' in BOOK', book)
    return (
     <TouchableOpacity style={styles.container} >
          {/*<View style={styles.imageContainer}>
            <Image  source={ {uri: imageLinks.thumbnail}} style={styles.image} />
          </View>*/}
           <Text style={styles.title} >{title}</Text>
          { loggedIn ?
   <Icon
  raised
  name='heart'
  type='font-awesome'
  color='#f50'
  size={44}
  onPress={()=>this.props.onSaveBook(book)} />
             : <Text>sign in to save</Text>}
     </TouchableOpacity>
    );
  }
}



const styles = StyleSheet.create({
  container:{
    backgroundColor: '#f8f8ff',

    display:'flex',
  },
  image: {
    flex:1,
    width: 66,
    height: 58
  }
});


export default connect(({ auth }) => ({ auth: auth }), null )(Book)

