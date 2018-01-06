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


export default class RNF extends Component {
  state = {
    image: null,
  };

  componentDidMount() {
    firebase.database().ref(`users/pic`).once('value', (snapshot) => {
      console.log(snapshot.val());
      this.setState({ image: btoa(snapshot.val().blobs) })
    })
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true
    });

    console.log(result, result.base64);


    var byteCharacters = atob(result.base64);
    firebase.database().ref(`users/pic`).set({ blobs: byteCharacters })
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
  render() {
    let { image } = this.state;
    console.log(image, ' iamge')
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
        {image ?
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: `data:image/jpeg;base64,${image}` }} />

          : null}
        <View style={{ margin: 60 }}>
          <Text></Text>
        </View>
      </View>
    );

  }
}
