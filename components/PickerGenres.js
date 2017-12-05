
import React, { Component } from 'react'
import {
   Modal,
   TouchableWithoutFeedback,
   Text,
   StyleSheet,
   Platform,
   View,
   Picker,
   TextInput,
   TouchableOpacity
 } from 'react-native';

import {genres} from './data/genres';

export default class PickerGenre extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      modalVisible: false,
    };
  }

  onPress = () => {
    this.setState({ modalVisible: true })
     //alert(this.state.modalVisible);
  }

 render() {
   
   return (
     <View  style={styles.inputContainer}>
       <TouchableOpacity
         style={styles.button}
         onPress={this.onPress}
       >
          <TextInput
              style={styles.input}
              editable={false}
              placeholder="Select genre"
              value={this.props.value}
            />
       </TouchableOpacity>
        <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}>
                <TouchableWithoutFeedback
                    onPress={() => this.setState({ modalVisible: false })}>
                  <View style={styles.modalContainer}>
                      <View style={styles.buttonContainer}>
                        <Text
                          style={{ color: 'blue' }}
                          onPress={() => this.setState({ modalVisible: false })}>
                          Done
                        </Text>
                      </View>
                      <View>
                        <Picker
                          selectedValue={this.props.value}
                          onValueChange={this.props.onValueChange}>
                          {genres.map((genre, index) => (
                            <Picker.Item
                              key={index}
                              label={genre.label}
                              value={genre.value}
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
              </TouchableWithoutFeedback>
         </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
   modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
    buttonContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#ececec',
  },
  inputContainer: {
    ...Platform.select({
      ios: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
      },
    }),
  },
})
