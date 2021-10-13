import React ,{useState,useRef,useEffect} from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Animated,Image } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {checkUser,getInfoUser} from '../../Contain/async';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector } from 'react-redux';
import ModalUse from '../Elements/ModalUse';
import * as FetchAPI from '../../Utils/fetchData';
import {chooseImageCamera,chooseImageLibrary} from '../../Contain/AdapterUpLoadImage';

export default function Person({navigation}){
    const link = useSelector(e=>e.link);
    const [statusLogin, setstatusLogin] = useState(false);
    const [showNotifyLogin, setshowNotifyLogin] = useState(false);
    const [showSpinner, setshowSpinner] = useState(false);
    const [contentHeader, setcontentHeader] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [dataUser, setdataUser] = useState();
    const [userName, setuserName] = useState('');
    const [email, setemail] = useState();
    const [dataImageURI, setdataImageURI] = useState("");
    const [showModalChooseImg, setshowModalChooseImg] = useState(false);
    useEffect(()=>{
        navigation.addListener('focus',()=>{
            setLogin();
        })
    },[])
    const setLogin = async()=>{
        setshowSpinner(true);
        const s = await checkUser();
        if(s==false){
            setstatusLogin(false);
            setshowSpinner(false);
            setcontentHeader(true);
            setdataUser(null);
            setdataImageURI('');
        }else{
            const user = await getInfoUser(link);
            setdataUser(user);
            setuserName(user.HoTen);
            setemail(user.Email);
            setAvatar(user.id);
            setstatusLogin(true);
            setcontentHeader(true);
        }
    }
    const setAvatar = async(id)=>{
        try {
            const data = {"ID":id}
            const res = await FetchAPI.postDataApi(link+"getUserById.php",data);
           
            if(res.Avatar==null||res.Avatar==""){
                setdataImageURI("");
                setshowSpinner(false);
            }else{
                console.log("2")
                if(res.Avatar.indexOf('http://')!==-1||res.Avatar.indexOf('https://')!==-1){
                    setdataImageURI(res.Avatar);
                }else{
                    setdataImageURI(link+res.Avatar);
                }
                setshowSpinner(false);
            }
        } catch (error) {
            
        }
      
    }
    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start();
    };
    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 2 seconds
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true
        }).start();
        setTimeout(()=>{
            setshowNotifyLogin(false);   
        },2000)
    };
    const handleShowNotify =()=>{
        setshowNotifyLogin(true);
        fadeIn();
        setTimeout(()=>{
            fadeOut();
        },2000)
    }
    const handleSeeInfor = async()=>{
        const s = await checkUser();
        if(s==false){
            handleShowNotify()
        }else{
            navigation.navigate('PersonInfor')
        }
    }
    const handleSeeHistory = async()=>{
        const s = await checkUser();
        if(s==false){
            handleShowNotify()
        }else{
            navigation.navigate("History")
        }
    }
    const handleLogout = ()=>{
        setshowSpinner(true);
        setTimeout(async()=>{
            await AsyncStorage.removeItem('@user');
            setLogin();
        },2000)
    }
    const handleChooseImage = async()=>{
        const s = await checkUser();
        if(s){
            setshowModalChooseImg(true);
        }else{
            handleShowNotify();
        }
    }
    const handleUploadImage = (dataI)=>{
        const formData = new FormData();
        console.log(Platform.OS);
        // formData.append('fileToUpload', dataI);
        formData.append('fileToUpload', { uri: Platform.OS === 'ios' ? dataI.uri.replace('file://', '') : dataI.uri, name: dataI.fileName, type: dataI.type });
        const xhr = new XMLHttpRequest();
        xhr.open('POST', link+"upload.php"); // the address really doesnt matter the error occures before the network request is even made.
        xhr.send(formData);
        xhr.onreadystatechange = e => {
            if (xhr.readyState !== 4) {
            return;
            }
            if (xhr.status === 200) {
                console.log(xhr.responseText)
                const res = JSON.parse(xhr.responseText);
                if(res.result=="Sorry, there was an error uploading your file."){
                    console.log("Không thể upload ảnh")
                    setshowSpinner(false);
                }else{
                    handleUpdateAvatar(res.result)
                }
            } else {
                console.log('error', xhr.responseText);
                setshowSpinner(false);
            }
        };
    }
    const handleUpdateAvatar = async(linkImg)=>{
        console.log(link+"uploads/"+linkImg)
        const img = "uploads/"+linkImg;
        const StringImg = JSON.stringify(img);
        const data = {
            "IDUSER":dataUser.id,
            "URLIMAGE":StringImg,
        }   
        const res = await FetchAPI.postDataApi(link+"updateAvatar.php",data);
        console.log(res)
        if(res.result=="successfully"){
            setAvatar(dataUser.id);
        }else{
            setshowSpinner(false);
        }
    }
    const handlechooseImageCamera = async()=>{
        setshowSpinner(true);
        setshowModalChooseImg(false);
        const res = await chooseImageCamera();
        if(res==false){
            setshowSpinner(false);
        }
        else{
            handleUploadImage(res);   
        }
    }
    const handlechooseImageLibrary = async()=>{
        setshowSpinner(true);
        setshowModalChooseImg(false);
        const res = await chooseImageLibrary();
        if(res==false){
            setshowSpinner(false);
        }
        else{
            handleUploadImage(res);   
        }
    }
    const ModalChooseImage = ()=>(
        <ModalUse
            visible={showModalChooseImg}
        >
            <View>
                <Text style={{ fontSize:18,fontWeight:'bold',textAlign:'center',paddingBottom:15 }}>Cập nhật ảnh đại diện</Text>
                <TouchableOpacity style={styles.selectionImage} onPress={()=>handlechooseImageCamera()}>
                    <Text style={{ fontSize:16 }}>Chọn ảnh từ Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.selectionImage} onPress={()=>handlechooseImageLibrary()}>
                    <Text  style={{ fontSize:16 }}>Chọn ảnh từ Thư viện</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCloseModalChoose} onPress={()=> setshowModalChooseImg(false)}>
                    <Text>Đóng</Text>
                </TouchableOpacity>
            </View>
        </ModalUse>
    )
    const ItemMenu = (props)=>{
        return(
            <TouchableOpacity style={styles.choose} onPress={()=>props.handle()}>
                    <View style={{ marginRight:10 }}>
                    {props.children}
                    </View>
                    <Text style={{ fontSize:16}}>{props.name}</Text>
                  
            </TouchableOpacity>
        )
    }
    return(
        <View style={{ flex:1 }}>
        <ModalChooseImage/>   
        {contentHeader &&
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>handleChooseImage()}>
                {dataImageURI=="" ? 
                <FontAwesome5 name="user-circle" size={100} color={"gray"}/>
                :
                <Image source={{ uri:dataImageURI }} style={{ width:100,height:100,borderRadius:50 }}/>
                }
                <View style={{ position:'absolute',top:85,left:85,zIndex:1 }}>
                    <FontAwesome5 name="camera-retro" size={15} color={"black"}/>
                </View>
                </TouchableOpacity>
                <View style={{ paddingLeft:15}}>
                    {statusLogin ? 
                    <View style={{ alignItems:'center' }}>
                        <Text style={{ fontWeight:'bold',fontSize:16 }}>
                            {userName}
                        </Text>
                        <Text style={{ paddingTop:8 }}>
                            {email}
                        </Text>
                    </View>
                    : 
                    <View>
                        <Text>Bạn chưa đăng nhập</Text>
                        <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
                            <Text style={{ color:'blue',textAlign:'center' }}>Đăng nhập ngay</Text>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
            </View>


            <View style={styles.body}>
                <ItemMenu name="Thông tin cá nhân"  handle={handleSeeInfor}>
                    <Ionicons name="information-circle-outline" size={24} color="red"/>
                </ItemMenu>
                <ItemMenu name="Giỏ hàng của bạn" handle={()=>navigation.navigate('Cart')}>
                    <Ionicons name="cart-outline" size={24} color="green" /> 
                </ItemMenu>
                <ItemMenu name="Lịch sử đơn hàng"  handle={handleSeeHistory}>
                    <MaterialIcons name="history" size={24} color="blue"/>
                </ItemMenu>
                <ItemMenu name="Các món ăn yêu thích" handle={()=>navigation.navigate('Favorite')}>
                    <Feather name="heart" size={24} color="red"/>
                </ItemMenu>
                <ItemMenu name="Đánh giá của bạn" handle={()=>console.log("Cái này cũng làm sau ")}>
                    <Ionicons name="star-outline" size={24} color="green"/>
                </ItemMenu>
                {statusLogin && 
                <ItemMenu name="Đăng xuất" handle={handleLogout} >
                    <MaterialIcons name="logout" size={24} color="blue"/>
                </ItemMenu>
                }
            </View>
            
        </View>
        }
        {showNotifyLogin && 
            <View style={styles.wrapperNotify}>
            <Animated.View style={[styles.notify,{opacity:fadeAnim}]}>
                <Text>Vui lòng đăng nhập ...</Text>
            </Animated.View>
            </View>
        }
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
        backgroundColor:'white'
    },
    header:{
        width:'100%',
        flexDirection:'column',
        height:200,
        padding:15,
        paddingTop:40,
        alignItems:'center',
    },
    body:{
        flex:1
    },
    choose:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        width:'100%',
        height:50,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingLeft:15,
        marginBottom:5
    },
    wrapperNotify:{
        flex:1,
        alignItems:'center',
        marginBottom:15
    },
    notify:{
        position:'absolute',
        backgroundColor:'rgba(0, 0, 0, 0.3)',
        bottom:0,
        width:'80%',
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:15
    },
    btnCloseModalChoose:{
        backgroundColor:'tomato',
        padding:10,
        borderRadius:15,
        alignItems:'center',
        marginTop:10,
        marginBottom:0
    },
    selectionImage:{
        padding:10,
        borderBottomColor:'gray',
        borderBottomWidth:1
    }
})