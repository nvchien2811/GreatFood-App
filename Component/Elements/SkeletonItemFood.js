import React from 'react';
import {View,StyleSheet,Dimensions} from 'react-native';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
export default function SkeletonItemFood(){

    return(
        <View style={styles.wrapperItemFood}>
        <SkeletonPlaceholder>
              <View  style={styles.imgItemFood }  />
              <View style={styles.textItemFood}/>
              <View style={styles.textItemFood}/>
        </SkeletonPlaceholder>
        </View>
    )
}
const styles= StyleSheet.create({
    wrapperItemFood:{
        width:Dimensions.get('window').width/2.5,
        flexDirection:'column',
        backgroundColor:'white',
        borderRadius:6,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        margin:20,
    },
    imgItemFood:{
        width:Dimensions.get('window').width/2.5,
        height:150,
    },
    textItemFood:{
        width:Dimensions.get('window').width/2.5,
        height:20,
        marginTop:10,
        marginBottom:5,
    }
})