import React from 'react';
import {View,Text} from 'react-native';

export default function MessengeError(props){
    return(
        <View style={{width:'100%'}}>
            {props.show &&
                <View style={{ width:'100%',paddingBottom:10,top:-5,paddingLeft:10 }}>
                    <Text style={{ color:'red' }}>{props.messengeErorr}</Text>
                </View>
            }
            </View>
    )
}