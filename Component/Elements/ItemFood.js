import React from 'react';
import {View,StyleSheet,Dimensions,Image,Text,TouchableOpacity} from 'react-native';
import {getPriceVND} from '../../Contain/getPriceVND';
import {setHTTP} from '../../Utils/setHTTP';
import { useSelector } from 'react-redux';
export default function ItemFood(props){
    const maxlimitText = 18;
    const link = useSelector(s=>s.link)
    const handleNav = ()=>{
        props.navigation();
    }
    return(
        <TouchableOpacity onPress={handleNav}>
        <View style={styles.wrapperItemFood}>
            <Image style={{height:props.imgheight}} source={{uri:setHTTP(props.item.hinhanh,link)}}/>
            <Text style={styles.textItemFood}>
                {((props.item.ten).length > maxlimitText) ? 
                (((props.item.ten).substring(0,maxlimitText-3)) + '...') 
                : props.item.ten }
            </Text>
            <Text style={styles.textItemFood}>{getPriceVND(props.item.gia)+" đ"}</Text>
        </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
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
    textItemFood:{
        padding:10,
        fontWeight:'bold'
    }

})