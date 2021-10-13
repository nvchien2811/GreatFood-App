import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default function Notify(){

    const Tab = (props)=>(
        <View>
            <TouchableOpacity  style={styles.tab}>
            {props.children}
            <Text style={{ paddingLeft:20,fontSize:16 }}>{props.topic}</Text>
            </TouchableOpacity>
        </View>
    )
    return(
        <View style={styles.wrapper}>
            <View style={styles.groupTabs}>
            <Tab topic="Tin khuyến mãi">
                <AntDesign name="notification" color="red" size={30}/>
            </Tab>
            <Tab topic="Hoạt động">
                <Feather name="bell" color="green" size={30}/>
            </Tab>
            <Tab topic="Đóng góp ý kiến">
                <FontAwesome name="shopping-basket" color="tomato" size={28}/>
            </Tab>
            </View>
            <ScrollView style={styles.body}>
                <View style={styles.aboveBody}>
                    <Text>Tất cả thông báo</Text>
                    <TouchableOpacity>
                        <Text  style={{ color:'blue' }}>Đọc tất cả (0)</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
} 
const styles = StyleSheet.create({
    wrapper:{
        flex:1,   
    },
    groupTabs:{
        width:'100%',
        backgroundColor:'white',
        padding:20,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
    },
    tab:{
        width:'100%',
        height:70,
        borderRadius:10,
        flexDirection:'row',
        shadowColor: "#000",
        backgroundColor:'white',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:5,
        padding:15,
        alignItems:'center',
        marginBottom:10
    },
    body:{
        flex:1,
        padding:20
    },
    aboveBody:{
        flexDirection:'row',
        justifyContent:'space-between'
    }
})