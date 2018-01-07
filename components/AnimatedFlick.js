import React, { Component } from 'react';
import { View, Text , ScrollView, FlatList, Image, StyleSheet, TouchableHighlight, Animated, Dimensions} from 'react-native';

let { width, height } = Dimensions.get('window');

export default class AnimatedFlick extends Component {
  constructor(props) {
    super(props);
    this.state = {  
      scrollx: new Animated.Value(0)
    };
  }

  shiftView(e){
    var x = e.nativeEvent.contentOffset.x;
     console.log(x);
    if( x>50){
      this._scrollView.scrollTo({x: 100, animated: true})
    }
  }

_handleScroll(e){
  var x = e.nativeEvent.contentOffset.x;
  console.log(x);
}
 
  render(){
   return (
         <Animated.ScrollView
            ref={ scrollView => this._scrollView = scrollView ? scrollView._component : null }
            horizontal={true}
            directionalLockEnabled={true}
            style={[{flex: 1, height: 100}]}
            onScroll={Animated.event([
            {
              nativeEvent: { contentOffset: { x: this.state.scrollx } }
            }],
            { useNativeDriver: true }, 
            //{ listener: this._handleScroll.bind(this) } //Added listener
            )}
            scrollEventThrottle={1}
            onMomentumScrollBegin={this.shiftView.bind(this)}
            showsHorizontalScrollIndicator={false}
          >
            {this.props.children}
          </Animated.ScrollView>
    );
  }
} 

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  outerScroll: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flex: 1
  }
});