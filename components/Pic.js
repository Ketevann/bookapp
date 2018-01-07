import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import firebase from 'firebase'
//import RNFetchBlob from 'react-native-fetch-blob'
import { ImagePicker } from 'expo';
import {dispatchCamera} from '../redux/actions/cameraActions'
import { connect } from 'react-redux'


const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const btoa= (input:string = '')  => {
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || (map = '=', i % 1);
    output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

      charCode = str.charCodeAt(i += 3/4);

      if (charCode > 0xFF) {
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }

      block = block << 8 | charCode;
    }

    return output;
  }

  atob= (input:string = '') => {
    let str = input.replace(/=+$/, '');
    let output = '';

    if (str.length % 4 == 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (let bc = 0, bs = 0, buffer, i = 0;
      buffer = str.charAt(i++);

      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }


class RNF extends Component {
  state = {
    image: null,
  };

  componentDidMount() {
    // firebase.database().ref(`users/pic`).once('value', (snapshot) => {
    //   console.log(snapshot.val());
    //   this.setState({ image: btoa(snapshot.val().blobs) })
    // })
    this._pickImage()
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    console.log(result, result.base64);


    var byteCharacters = atob(result.base64);
    const {id} = this.props
    console.log(id, ' ID ID')
    firebase.database().ref(`users/${id}`).update({ avatar: byteCharacters })
    this.props.dispatchCamera(false)
    // //
  };
  render() {
    let { image } = this.state;
    console.log(image, ' iamge')
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>



        <View style={{ margin: 60 }}>
          <Text></Text>
        </View>
      </View>
    );

  }
}
//dispatchCamera
export default connect(({cameraRoll}) => ({ cameraRoll}), {
  dispatchCamera
})(RNF);
// {image ?
//           <Image
//             style={{ width: 200, height: 200 }}
//             source={{ uri: `data:image/jpeg;base64,${image}` }} />

//           : null}
  // <Button
  //         title="Pick an image from camera roll"
  //         onPress={this._pickImage}
  //       />
