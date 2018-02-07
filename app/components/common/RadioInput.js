import React, { Component } from 'react';
import { Input,Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';


class RadioInput extends React.Component {
  constructor(props) {
    super(props)
     this.state={
        selectedIndex:null,
        label:null
       }
  }
    componentWillReceiveProps(newProps){
        let index=null;
        if (newProps.preferenceType==='title'){
            index=0;
        }
        else if (newProps.preferenceType==='author'){
            index=1;
        }
        this.setState({
            selectedIndex:index,
            label:newProps.preferenceType
        })
    }

  changeActiveRadioButton(index, label){
    this.setState({ selectedIndex:index, label:label}, ()=>{
        this.props.onChangeSelection(label);
    });
    }

  render() {
    const { children } = this.props;
    const childrenWithProps=() => React.Children.map(children, (child, index)=>{
        return React.cloneElement(child, { onClick: this.changeActiveRadioButton.bind(this, index, child.props.label), active:this.state.selectedIndex === index });
    });
    return (
      <View style={{flex:1}}>
            {/*<Text style={styles.selectedTextHolder}> {this.state.label}</Text>*/}
        {childrenWithProps()}
       </View>
    )
  }
}



const styles = StyleSheet.create(
{
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25
    },
    selectedTextHolder:
    {
        // position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 15,
        //backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    selectedText:
    {
        fontSize: 18,
        color: 'white'
    }
});

export { RadioInput };
