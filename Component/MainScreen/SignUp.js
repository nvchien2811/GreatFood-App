import React ,{useState} from 'react';
import {View,Text,StyleSheet,StatusBar,TouchableOpacity,TextInput,ScrollView} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import * as FetchAPI from '../../Utils/fetchData';
import { useSelector } from 'react-redux';
import ModalUse from '../Elements/ModalUse';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Validation from '../../Contain/ValidationString';
import MessengeError from '../Elements/MessengeError';
export default function SignUp({navigation}){
    const link = useSelector(s=>s.link);
    const [name, setname] = useState();
    const [username, setusername] = useState();
    const [password, setpassword] = useState();
    const [repass, setrepass] = useState();
    const [address, setaddress] = useState();
    const [phone, setphone] = useState();
    const [email, setemail] = useState();
    const [hidePass, sethidePass] = useState(true);
    const [showModalSuccess, setshowModalSuccess] = useState(false);
    const [showSpinner, setshowSpinner] = useState();
    const [messengeErorr, setmessengeErorr] = useState();
    const [codeShow, setcodeShow] = useState('');
    
    const [usernameTmp, setusernameTmp] = useState();
    const [passwordTmp, setpasswordTmp] = useState();
    const handleCheckValidation = ()=>{
        if(!Validation.validateName(name)){
            setmessengeErorr("Họ tên phải dài hơn 2 và nhỏ hơn 30 ký tự, không ký tự đặc biệt")
            setcodeShow('nameInvalid')
        }
        else if(!Validation.validateUserName(username)){
            setmessengeErorr("Tên đăng nhập phải dài hơn 2 nhỏ hơn 30 ký tự và không có dấu, không ký tự đặc biệt")
            setcodeShow('usernameInvalid')
        }
        else if(!Validation.validatePass(password)){
            setmessengeErorr("Mật khẩu có ít nhất 6 ký tự, ít nhất 1 chữ in hoa, 1 chữ thường và 1 chữ số")
            setcodeShow('passInvalid')
        }
        else if(password!==repass){
            setmessengeErorr("Nhập lại mật khẩu không khớp")
            setcodeShow('passNotEquals')
        }
        else if(!Validation.validateName(address)){
            setmessengeErorr("Vui lòng nhập địa chỉ")
            setcodeShow('addressInvalid')
        }
        else if(Validation.validateEmail(email)==false){
            setmessengeErorr("Vui lòng nhập đúng email")
            setcodeShow('emailInvalid')
        }
        else if(Validation.validatePhoneNumber(phone)==false){
            setmessengeErorr("Vui lòng nhập đúng số điện thoại")
            setcodeShow('phoneInvalid')
        }
        else{
            setshowSpinner(true);
            setcodeShow('');
            handleSignUp();
        }
    }

    const handleSignUp = async()=>{
        const data={
            "HOTEN":name,
            "USERNAME":username.toLowerCase(),
            "PASSWORD":password,
            "EMAIL":email,
            "PHONE":phone,
            "ADDRESS":address
        }
        const res = await FetchAPI.postDataApi(link+"signup.php",data);
        console.log(res)
        if(res.result=="errUserName"){
            setmessengeErorr("Tên đăng nhập đã tồn tại, vui lòng chọn tên khác")
            setcodeShow('userNameExist')
        }else if(res.result=="errEmail"){
            setmessengeErorr("Email đã tồn tại, chọn email khác")
            setcodeShow('emailExist')
        }else if(res.result=="error"){
            console.log("Có lỗi đăng ký")
            setcodeShow('')
        }else{
            setcodeShow('')
            handleCleanInput()
            setshowModalSuccess(true)
        }
        setshowSpinner(false);
    }

    const handleCleanInput = ()=>{
        setusernameTmp(username);
        setpasswordTmp(password);
        setname('');
        setusername('');
        setpassword('');
        setrepass('');
        setaddress('');
        setemail('');
        setphone('');
    }
    const handleNavLogin = ()=>{
        navigation.navigate('Login',{username:usernameTmp,password:passwordTmp})
    }
    const ModalSuccess = ()=>{
        return(
            <ModalUse 
                visible = {showModalSuccess}
            >
                <View style={{ alignItems:'center' }}>
                    <Text>Đăng ký thành công</Text>
                </View>
                <View style={{ alignItems:'center' }}>
                    <Text>Đăng nhập ngay bây giờ</Text>
                </View>
                <View style={styles.groupBtnModal}>
                <TouchableOpacity style={styles.btnCloseModal} onPress={()=>setshowModalSuccess(false)}>
                    <Text style={{  color:'white', }}>Để sau</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOrderSure} onPress={handleNavLogin}>
                    <Text style={{  color:'white', }}>Đăng nhập</Text>
                </TouchableOpacity>
                </View>

            </ModalUse>
        )
    }
    return(
        <ScrollView style={[styles.wrapper,showModalSuccess ? {backgroundColor:'rgba(0,0,0,0.4)'}:'']}>
            <StatusBar
                barStyle="dark-content"
            />
            <ModalSuccess/>
            <View style={[styles.body,showModalSuccess ? {backgroundColor:'transparent',elevation: 0}:'']}>
                <View style={styles.wrapperInput}>
                    <Entypo name="user" size={20} color="gray" style={styles.inputIcon}/>
                    <TextInput 
                        placeholder="Nhập đầy đủ họ tên"
                        onChangeText={(e)=>setname(e)}
                        value={name}
                        style={styles.input}
                    />
                </View>
                <MessengeError messengeErorr={messengeErorr} show={'nameInvalid'==codeShow}/>

                <View style={styles.wrapperInput}>
                    <Entypo name="v-card" size={20} color="gray" style={styles.inputIcon}/>
                    <TextInput 
                        placeholder="Nhập tên đăng nhập"
                        onChangeText={(e)=>setusername(e)}
                        value={username}
                        style={styles.input}
                    />
                </View>
                <MessengeError  messengeErorr={messengeErorr} show={'usernameInvalid'==codeShow || 'userNameExist'==codeShow}/>

                <View style={styles.wrapperInput}>
                    <Entypo name="lock" size={20} color="gray" style={styles.inputIcon}/>
                    <TextInput 
                        placeholder="Nhập mật khẩu"
                        onChangeText={(e)=>setpassword(e)}
                        value={password}
                        style={styles.input}
                        secureTextEntry={hidePass}
                    />
                    <TouchableOpacity onPress={()=>sethidePass(!hidePass)} style={styles.inputIconShowPass}>
                        {hidePass ?
                            <Entypo name="eye-with-line" size={20} color="gray" />
                        :
                            <Entypo name="eye" size={20} color="gray" />
                        }
                          
                    </TouchableOpacity>
                </View>
                <MessengeError  messengeErorr={messengeErorr} show={'passInvalid'==codeShow}/>

                <View style={styles.wrapperInput}>
                    <Entypo name="lock" size={20} color="gray" style={styles.inputIcon}/>
                    <TextInput 
                        placeholder="Nhập lại mật khẩu"
                        onChangeText={(e)=>setrepass(e)}
                        value={repass}
                        style={styles.input}
                        secureTextEntry={hidePass}
                    />
                </View>
                <MessengeError  messengeErorr={messengeErorr} show={'passNotEquals'==codeShow}/>

                <View style={styles.wrapperInput}>
                    <Entypo name="address" size={20} color="gray" style={styles.inputIcon}/>
                    <TextInput 
                        placeholder="Nhập địa chỉ"
                        onChangeText={(e)=>setaddress(e)}
                        value={address}
                        style={styles.input}
                    />
                </View>
                <MessengeError  messengeErorr={messengeErorr} show={'addressInvalid'==codeShow}/>

                <View style={styles.wrapperInput}>
                    <Entypo name="email" size={20} color="gray" style={styles.inputIcon}/>
                    <TextInput 
                        placeholder="Nhập Email"
                        onChangeText={(e)=>setemail(e)}
                        value={email}
                        style={styles.input}
                    />
                </View>
                <MessengeError  messengeErorr={messengeErorr} show={'emailInvalid'==codeShow || 'emailExist' == codeShow}/>

                <View style={styles.wrapperInput}>
                    <Entypo name="phone" size={20} color="gray" style={styles.inputIcon}/>
                    <TextInput 
                        placeholder="Nhập số điện thoại"
                        onChangeText={(e)=>setphone(e)}
                        value={phone}
                        style={styles.input}
                    />
                </View>
                <MessengeError  messengeErorr={messengeErorr} show={'phoneInvalid'==codeShow}/>

            </View>
            <View style={{ alignItems:'center' }}>
            <TouchableOpacity style={styles.btnSignUp} onPress={handleCheckValidation}>
                <Text style={{ fontSize:16,color:'white' }}>Đăng ký ngay</Text>
            </TouchableOpacity>
            </View>
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
    body:{
        alignItems:'center',
        backgroundColor:'white',
        padding:25,
        borderRadius:15,
        margin:20,
        shadowColor: "#000",
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity:  0.4,
        shadowRadius: 3,
        elevation: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderRadius:15,
        width:'100%',
        paddingLeft:40,
        paddingRight:40,
        marginBottom:20,
    },
    wrapperInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnSignUp:{
        backgroundColor:'tomato',
        padding:10,
        borderRadius:5,
        alignItems:'center',
        width:150,
        marginBottom:20
    },
    inputIcon: {
        position:'absolute',
        left:10,
        top:14
    },
    btnCloseModal:{
        backgroundColor:'red',
        padding:10,
        borderRadius:15,
        width:100,
        alignItems:'center',
        justifyContent:'center'
    },
    btnOrderSure:{
        backgroundColor:'blue',
        padding:10,
        borderRadius:15,
        marginLeft:20,
        width:100,
        justifyContent:'center',
        alignItems:'center'
    },
    groupBtnModal:{
        flexDirection:'row',
        paddingTop:10
    },
    inputIconShowPass: {
        position:'absolute',
        right:20,
        top:14
    },
})