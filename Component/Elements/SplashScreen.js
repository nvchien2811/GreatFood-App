import AsyncStorage from '@react-native-community/async-storage';
import React,{useEffect,useRef} from 'react';
import { View,StatusBar,StyleSheet,Animated } from 'react-native';

export default function SplashScreen({navigation}){

    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver:true
        }).start();
        setTimeout(async()=>{
            const showIntroduction = await AsyncStorage.getItem('@introduction');
            if(showIntroduction=='done'){
                navigation.replace('BottomNav');
            }else{
                navigation.replace('Introduction');
            }
        },3000)
    }, []);
    return(
        <View style={styles.wrapper}>
            <StatusBar 
                animated={true}
                backgroundColor="white"
                barStyle="dark-content" 
            />
            <Animated.Text style={{ fontSize:36,fontWeight:'bold',color:'tomato',opacity:fadeAnim }}>Great Food</Animated.Text>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
    }
})