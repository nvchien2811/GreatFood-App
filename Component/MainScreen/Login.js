import React ,{useState,useRef,useEffect} from 'react';
import { View,Text,StyleSheet,StatusBar,ImageBackground,TextInput,Dimensions,TouchableOpacity,Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import * as FetchAPI from '../../Utils/fetchData';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default function Login({navigation,route}){
    const link = useSelector(e=>e.link);
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [hidePass, sethidePass] = useState(true);
    const [showSpinner, setshowSpinner] = useState(false);
    const secondTextInput = useRef();
    const clickBtnLogin = useRef();
    const handleCheckLogin = ()=>{
        setshowSpinner(true);
        console.log("Thông tin "+ username + "và " + password);
        handleLogin();
    }
    useEffect(()=>{
        navigation.addListener('focus',()=>{
            setRouTe();
        })
    })
    const setRouTe = ()=>{
        if(route.params!==undefined){
            setusername(route.params.username);
            setpassword(route.params.password);
        }
    }
    const handleLogin = async()=>{
        const data = {
            "USERNAME":username.toLowerCase(),
            "PASSWORD":password,
        }
        const res = await FetchAPI.postDataApi(link+"taoToken.php",data);
        const result = res.token;
        if(result == "ERROR"){
            setshowSpinner(false);
            console.log("Đăng nhập thất bại");
           
        }
        else{
            setshowSpinner(false);
            await AsyncStorage.setItem('@user',result);
            navigation.navigate('Person')
        }
    }
   
    return(
        <View style={styles.wrapper}>   
            <ImageBackground source={require('../../Images/bg_login.jpg')} resizeMode="cover" style={styles.background}>
            <View style={styles.child}>
                <StatusBar 
                    animated={true}
                    translucent backgroundColor="transparent"
                    barStyle="light-content" 
                />
                <Text style={styles.textTopic}>Great Food</Text>
                <View style={styles.groupInput}>
                    <View style={styles.wrapperInput}>
                        <Entypo name="user" size={20} color="white" style={styles.inputIcon}/>
                        <TextInput
                            style={styles.input}
                            onChangeText={(e)=>setusername(e)}
                            value={username}
                            placeholder="Nhập tên đăng nhập"
                            placeholderTextColor="#DDDDDD"
                            color="white"
                            underlineColorAndroid= 'transparent'
                            onSubmitEditing={()=>secondTextInput.current.focus()}
                            selectionColor='black'
                        />
                    </View>
                    <View style={styles.wrapperInput}>
                        <Entypo name="lock" size={20} color="white" style={styles.inputIcon}/>
                        <TextInput
                            style={styles.input}
                            onChangeText={(e)=>setpassword(e)}
                            value={password}
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor="#DDDDDD"
                            color="white"
                            secureTextEntry={hidePass}
                            ref={secondTextInput}
                            selectionColor='black'
                        />
                        <TouchableOpacity onPress={()=>sethidePass(!hidePass)} style={styles.inputIconShowPass}>
                            {hidePass ?
                                <Entypo name="eye-with-line" size={20} color="white" />
                            :
                                <Entypo name="eye" size={20} color="white" />
                            }
                          
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width:'100%',alignItems:'center' }}>
                    <TouchableOpacity style={styles.forgetPass}>
                        <Text style={{ color:'white' }}>Quên mật khẩu ?</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width:'100%',alignItems:'center' }}>
                    <TouchableOpacity ref={clickBtnLogin} style={styles.btnLogin} onPress={handleCheckLogin}>
                        <Text style={{ color:'white' }}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ color:'white',paddingTop:15 }}>Hoặc đăng nhập bằng</Text>
                <View style={styles.groupOtherLogin}>
                    <TouchableOpacity >
                        <Image style={styles.iconOtherLogin} source={require("../../Images/facebook.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.iconOtherLogin} source={require("../../Images/google.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.wrapperSignUp}> 
                    <TouchableOpacity onPress={()=>navigation.navigate('SignUp')}>
                        <Text style={{ color:'white',fontSize:18 }}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ImageBackground>
            <Spinner
                styles={{ flex:1 }}
                visible={showSpinner}
            />
            
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    background:{
        flex:1,
        width:'100%',
    },
    child: {
        flex: 1,
        width:'100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: "center",
        alignItems:'center',  
    },
    textTopic:{ 
        color:'white',
        fontSize:32,
        paddingBottom:50,
    },
    wrapperInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputIcon: {
       position:'absolute',
       left:30
    },
    inputIconShowPass: {
        position:'absolute',
        right:30
    },
    input: {
        height: 50,
        margin: 18,
        borderWidth: 1,
        padding: 10,
        borderColor:'white',
        borderRadius:15,
        width:Dimensions.get('window').width * 0.75,
        backgroundColor:'rgba(255,255,255,0.2)',
        paddingLeft:40,
        paddingRight:40
    },
    forgetPass: {
        width:'70%',
        paddingBottom:20,
        alignItems:'flex-end',
        justifyContent:'center',
        paddingRight:15
    },
    btnLogin: {
        width:'70%',
        height:50,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'red',
        borderRadius:15
    },
    wrapperSignUp:{
        position:'absolute',
        bottom:28
    },
    groupOtherLogin: {
        width:'100%',
        height:50,
        flexDirection:'row',
        justifyContent:'center' 
    },
    iconOtherLogin: {
        width:30,
        height:30,
        margin:10 
    }
})