import   React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from './common';
import { connect } from 'react-redux';
import   firebase from 'firebase';


class Book extends Component {
  
  render() {
    const { imageLinks, title } = this.props.book,
          { loggedIn } = this.props.auth;
    return (
     <TouchableOpacity style={styles.container} >
          {/*<View style={styles.imageContainer}>
            <Image  source={ {uri: imageLinks.thumbnail}} style={styles.image} />
          </View>*/} 
           <Text style={styles.title} >{title}</Text>           
          { loggedIn ?  <Button onPress={()=>this.props.onSaveBook(title)}> Save </Button> : <Text>sign in to save</Text>}
     </TouchableOpacity>
    );
  }
}



const styles = StyleSheet.create({
  container:{
    backgroundColor: '#f8f8ff',
    height:50,
    display:'flex',
  },
  image: {
    flex:1,
    width: 66, 
    height: 58             
  }
});


export default connect(({ auth }) => ({ auth: auth }), null )(Book)

