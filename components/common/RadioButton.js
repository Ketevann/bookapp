import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const RadioButton = (props) => {
        const { onClick, active , label, size, color } = props;     
        return(
            <TouchableOpacity onPress = { onClick } activeOpacity = { 0.8 } style = { styles.radioButton }>
                <View style = {[ styles.radioButtonHolder, { height: size, width: size, borderColor: color }]}>
                {
                    (active) ? (<View style = {[ styles.radioIcon, { height: size / 2, width: size / 2, backgroundColor: color }]}></View>) : null
                }
                </View>
                <Text style = {[ styles.label, { color: color }]}>{ label }</Text>
            </TouchableOpacity>
        );
    }

const styles = StyleSheet.create({
    radioButton:
    {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },

    radioButtonHolder:
    {
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    radioIcon:
    {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },

    label:
    {
        marginLeft: 10,
        fontSize: 20
    }});

export { RadioButton };