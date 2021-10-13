import React ,{useEffect,useState,useRef}from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Image,TextInput,ScrollView} from 'react-native';
import {getInfoUser} from '../../Contain/async';
import { useSelector } from 'react-redux';
import * as FetchAPI from '../../Utils/fetchData';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ModalUse from '../Elements/ModalUse';
import Spinner from 'react-native-loading-spinner-overlay';
import {chooseImageCamera,chooseImageLibrary} from '../../Contain/AdapterUpLoadImage'
export default function PersonInfor(){
    const link = useSelector(e=>e.link);
    const [datauser, setdatauser] = useState();
    const [dataImageURI, setdataImageURI] = useState();
    const [showContent, setshowContent] = useState(false);
    const [allowEditName, setallowEditName] = useState(false);
    const [showModalChooseImg, setshowModalChooseImg] = useState(false);
    const [showSpinner, setshowSpinner] = useState();
    const nameRef = useRef();
    useEffect(()=>{
        getDataUser();
    },[])
    const getDataUser = async()=>{
        try {
            const user = await getInfoUser(link);
            if(user!==undefined){
                setData(user.id);
            }
        } catch (error) {
        }
       
    }
    const setData = async(id)=>{
        try {
            const data={"ID":id};
            const res = await FetchAPI.postDataApi(link+"getUserById.php",data);
            setdatauser(res);
            console.log(res)
            if(res.Avatar==null||res.Avatar==""){
                setdataImageURI("");
                setshowContent(true);
            }else{
                if(res.Avatar.indexOf('http://')!==-1||res.Avatar.indexOf('https://')!==-1){
                    setdataImageURI(res.Avatar);
                }else{
                    setdataImageURI(link+res.Avatar);
                }
                setshowContent(true)
            }
        } catch (error) {    
        }
      
    }
    const handleEditName = ()=>{
        setallowEditName(!allowEditName);
        if(allowEditName==false){
            setTimeout(()=>{
                nameRef.current.focus();
            },200)
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
            "IDUSER":datauser.id,
            "URLIMAGE":StringImg,
        }   
        const res = await FetchAPI.postDataApi(link+"updateAvatar.php",data);
        console.log(res)
        if(res.result=="successfully"){
            setData(datauser.id);
            setshowSpinner(false);
        }else{
            setshowSpinner(false);
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
    const handleTextAdress = (text)=>{
        if(text!==""){
            return text;
        }else{
            return "Bạn chưa nhập địa chỉ";
        }
    }
    return(
        <ScrollView  
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled
        >
            <ModalChooseImage/>
            {showContent && 
            <View style={styles.wrapper}>
            <View style={styles.cardHeader}>
                <TouchableOpacity onPress={()=>setshowModalChooseImg(true)}>
                    {dataImageURI=="" ? 
                    <FontAwesome5 name="user-circle" size={100} color={"gray"}/>
                    :
                    <Image source={{ uri:dataImageURI }} style={{ width:100,height:100,borderRadius:50 }}/>
                    }
                    <View style={{ position:'absolute',top:85,left:85,zIndex:1 }}>
                        <FontAwesome5 name="camera-retro" size={15} color={"black"}/>
                    </View>
                </TouchableOpacity>
                <View style={styles.name}>
                    <TextInput 
                        onChangeText={(e)=>setdatauser({...datauser,HoTen:e})}
                        value={datauser.HoTen}
                        editable={allowEditName}
                        style={{ color:'black',fontSize:18 }}
                        ref={nameRef}
                    />
                    <TouchableOpacity style={{ paddingLeft:5 }} onPress={handleEditName}>
                        <FontAwesome5 name="pencil-alt" size={15} color={"black"}/>
                    </TouchableOpacity>
                </View>
                <Text style={{ color:'gray' }}>ID: {datauser.id}</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.groupInfor}>
                    <View style={styles.Infor}>
                        <Text>Địa chỉ Email</Text>
                        <TextInput 
                            onChangeText={(e)=>setdatauser({...datauser,Email:e})}
                            value={datauser.Email}
                            editable={allowEditName}
                            style={{ color:'black',fontSize:16 }}
                        />
                    </View>
                    <View style={styles.Infor}>
                        <Text>Địa chỉ liên lạc</Text>
                        <TextInput 
                            onChangeText={(e)=>setdatauser({...datauser,Address:e})}
                            value={handleTextAdress(datauser.Address)}
                            editable={allowEditName}
                            style={{ color:'black',fontSize:16 }}
                        />
                    </View>
                    <View style={styles.Infor}>
                        <Text>Số điện thoại</Text>
                        <TextInput 
                            onChangeText={(e)=>setdatauser({...datauser,phone:e})}
                            value={datauser.phone}
                            editable={allowEditName}
                            style={{ color:'black',fontSize:16 }}
                        />
                    </View>
                </View>

               <View style={{ flex:1,alignItems:'center' }}>
               <TouchableOpacity style={styles.btnUpdate} onPress={()=>console.log("Này làm sau")}>
                   <Text style={{ color:'white' }}>Cập nhật thông tin</Text>
               </TouchableOpacity>
               </View>
             
            </View>
            </View>
            }
            
            <Spinner
                styles={{ flex:1 }}
                visible={showSpinner}
            />
        </ScrollView>
    )

}
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
       
    },
    cardHeader:{
        flex:0.1,
        backgroundColor:'white',
        margin:15,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    body:{
        flex:1,
        backgroundColor:'white',
        margin:15,
        marginTop:0,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    name:{
        flexDirection:'row',
        alignItems:'center'
    },
    groupInfor:{
        flex:0.1,
        padding:15
    },
    btnUpdate:{
        padding:15,
        backgroundColor:'tomato',
        justifyContent:'center',
        alignItems:'center',
        width:'50%',
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    Infor:{
        marginBottom:10,
        borderBottomWidth:0.5,
        borderColor:'gray'
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