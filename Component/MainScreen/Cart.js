import React,{useEffect,useState} from 'react';
import {View,Text,StyleSheet,FlatList,Image,TouchableOpacity,Animated,Modal} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getAmountCart} from '../../Contain/getAmount';
import * as FetchAPI from '../../Utils/fetchData';
import {checkUser} from '../../Contain/async';
import ModalUse from '../Elements/ModalUse';
import { getInfoUser } from '../../Contain/async';
import {getPriceVND} from '../../Contain/getPriceVND';
import {setHTTP} from '../../Utils/setHTTP';
export default function Cart({navigation}){
    const link = useSelector(state=>state.link);
    const [dataCart,setDataCart] = useState();
    const [showSpinner, setShowSpinner] = useState(false);
    const [Total, setTotal] = useState(0);
    const dispatch = useDispatch();
    const [visibleContent, setvisibleContent] = useState(false);
    const [showCartEmpty, setshowCartEmpty] = useState(false);
    const [showModalLogin, setshowModalLogin] = useState(false);
    const [showModalPayment, setshowModalPayment] = useState(false);
    //height of Swipe Right
    const height = new Animated.Value(70)

    useEffect(() => {
        setShowSpinner(true);
        getCart();
        navigation.setOptions({
            headerLeft:()=>(
               <TouchableOpacity style={{ paddingLeft:10 }} onPress={()=>navigation.popToTop()}>
                   <Ionicons name="arrow-back" size={24}/>
               </TouchableOpacity>
            ),
            headerRight:()=>(
                <TouchableOpacity style={{ paddingRight:15 }} onPress={handleSeeHistory}>
                    <MaterialCommunityIcons name="history" size={24}/>
                </TouchableOpacity>
             )
        })
    },[]);

    const animatedDelete=() => {
        Animated.timing(height,{
            toValue: 0,
            duration: 350,
            useNativeDriver:false
        }).start()
    }
    //SwipeRight of View
    const swipeRight = (progress,dragX,id) =>{
        const scale = dragX.interpolate({
          inputRange:[-200,0],
          outputRange:[1,0.5],
          extrapolate:'clamp'
        })
        return(
          <Animated.View style={styles.swipeRight}>
            <TouchableOpacity onPress={()=>handleDeletItem(id)} style={{transform:[{scale}]}}>
                <FontAwesome5  name="trash-alt" size={34} color={"white"}/>
            </TouchableOpacity>
          </Animated.View>
        )
    }
    const getCart = async()=>{
        let arr = [];
        const StringCartCurrent = await AsyncStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        if(StringCartCurrent==null){
            getDataCart(arr);
        }else{
            getDataCart(arrCartCurrent);
        }
    }
    const getDataCart = async(arrCartCurrent)=>{
        let arrTmp = []; 
        if(arrCartCurrent.length==0){
            setShowSpinner(false);
            setvisibleContent(true);
            setshowCartEmpty(true);
            setDataCart(arrTmp);
        }else{
            for(let i=0;i<arrCartCurrent.length;i++){
                const data = {
                    "IDMONAN":arrCartCurrent[i].id,
                    "SOLUONG":arrCartCurrent[i].soluong
                }
                const res = await FetchAPI.postDataApi(link+"getMonAnById.php",data);
                arrTmp = arrTmp.concat(res); 
                if(i==arrCartCurrent.length-1){
                    setDataCart(arrTmp);
                    handleGetTotal(arrTmp);
                }
            }
        }
     
    }
    const handleGetTotal = (arrTmp)=>{
        let totalTmp = 0;
        arrTmp.map(e=>{
            totalTmp+=e.gia*e.soluong;
        })
        setvisibleContent(true);
        setShowSpinner(false);
        setTotal(totalTmp);
    }
    const handleSeeHistory = async()=>{
        const s = await checkUser();
        if(s){
            navigation.navigate('History');
        }else{
            setshowModalLogin(true)
        }
    }
    // handle Item and Amount
    const handlePlusAmount = async(i)=>{
        setShowSpinner(true);
        const StringCartCurrent = await AsyncStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        let index = arrCartCurrent.findIndex(x=>x.id==i);
        arrCartCurrent[index].soluong++;
        await AsyncStorage.setItem('@cart',JSON.stringify(arrCartCurrent));
        getDataCart(arrCartCurrent);
    }
    const handleMinusAmount = async(i)=>{
        setShowSpinner(true);
        const StringCartCurrent = await AsyncStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        let index = arrCartCurrent.findIndex(x=>x.id==i);
        if(arrCartCurrent[index].soluong==1){
            arrCartCurrent.splice(index,1);
        }else{
            arrCartCurrent[index].soluong--;
        }
        await AsyncStorage.setItem('@cart',JSON.stringify(arrCartCurrent));
        getDataCart(arrCartCurrent);
        getAmountCart(dispatch);
    }
    const handleDeletItem = async(i)=>{
        setShowSpinner(true);
        const StringCartCurrent = await AsyncStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        let index = arrCartCurrent.findIndex(x=>x.id==i);
        arrCartCurrent.splice(index,1);
        await AsyncStorage.setItem('@cart',JSON.stringify(arrCartCurrent));
        getDataCart(arrCartCurrent);
        getAmountCart(dispatch);
    }
    // handle Item and Amount

    const handleCheckPayment = async()=>{
        const s = await checkUser();
        if(s==false){
            setshowModalLogin(true);
        }else{
            setshowModalPayment(true);
        }
    }
    const handlePaymet = async()=>{
        setShowSpinner(true);
        const user = await getInfoUser(link);
        const idUser = user.id;
        console.log(idUser);
        const StringCartCurrent = await AsyncStorage.getItem('@cart');
        const arr = JSON.parse(StringCartCurrent);
        const data = {
            "MANGMONAN":arr,
            "STATUS":0,
            "TONGTIEN":Total,
            "IDUSER":idUser
        }
        const res = await FetchAPI.postDataApi(link+"addBill.php",data);
        if(res.result=="successfully"){
            await AsyncStorage.removeItem('@cart');
            getDataCart([]);
            getAmountCart(dispatch);
            setShowSpinner(false);
        }else{

        }
    }
    //Render
    const renderItemCart = ({item,index})=>{
        return(
            <Swipeable 
                renderRightActions={(progress,dragX)=>swipeRight(progress,dragX,item.id)} 
                rightThreshold={-200} 
                onSwipeableOpen={animatedDelete}
            >
            <View style={styles.wrapperItem}>
                <View>
                    <Image style={styles.imgItem} source={{ uri:setHTTP(item.hinhanh,link) }}/>
                </View>
                <View style={styles.descrepItem}>
                    <Text style={{ fontSize:16,fontWeight:'bold' }}>{item.ten}</Text>
                    <Text>{getPriceVND(item.gia*item.soluong)+ " đ"}</Text>
                </View>
                <View style={styles.editAmount}>
                    <TouchableOpacity onPress={()=>handlePlusAmount(item.id)}>
                        <AntDesign name="plus" size={20}/>
                    </TouchableOpacity>
                    <Text>{item.soluong}</Text>
                    <TouchableOpacity onPress={()=>handleMinusAmount(item.id)}>
                        <AntDesign name="minus" size={20}/>
                    </TouchableOpacity>
                </View>
            </View>
            </Swipeable>
        )
    }
    const ModalLogin = ()=>{
        return(
            <ModalUse 
                visible={showModalLogin}
            >
                <View style={{ alignItems:'center' }}>
                    <Text>Bạn chưa đăng nhập</Text>
                    <Text style={{ textAlign:'center' }}>Vui lòng đăng nhập để thực hiện thao tác này !</Text>
                </View>
                <View style={styles.groupBtnModal}>
                <TouchableOpacity style={styles.btnCloseModal} onPress={()=>setshowModalLogin(false)}>
                    <Text style={{  color:'white', }}>Để sau</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOrderSure} onPress={()=>{setshowModalLogin(false);navigation.navigate("Login")}}>
                    <Text style={{  color:'white', }}>Đăng nhập</Text>
                </TouchableOpacity>
                </View>
            </ModalUse>
        )
    }
    const ModalPayment = ()=>{
        return(
            <ModalUse 
                visible={showModalPayment}
            >
                <View style={{ alignItems:'center' }}>
                    <Text>Bạn có chắc chắn muốn đặt hàng</Text>
                </View>
                <View style={styles.groupBtnModal}>
                <TouchableOpacity style={styles.btnCloseModal} onPress={()=>setshowModalPayment(false)}>
                    <Text style={{  color:'white', }}>Để sau</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOrderSure} onPress={()=>{setshowModalPayment(false);handlePaymet()}}>
                    <Text style={{  color:'white', }}>Chắc chắn</Text>
                </TouchableOpacity>
                </View>
            </ModalUse>
        )
    }
    return(
        <View style={styles.wrapper}>
            <ModalLogin />
            <ModalPayment/>
            {visibleContent && 
                <View style={{ flex:1 }}>
                {!showCartEmpty ?
                    <View style={{ flex:1 }}>
                    <View style={{ flex:1 }}>
                    <FlatList
                        data={dataCart}
                        renderItem={renderItemCart}
                        keyExtractor={item=>item.id}   
                    />
                    </View>
                    <View style={styles.payment}>
                        <View>
                            <Text style={{ fontWeight:'bold',fontSize:16 }}>Tổng tiền :</Text>
                            <Text style={{ fontStyle:'italic' }}>Đã áp dụng thuế VAT</Text>
                        </View>

                        <View style={{ paddingRight:10,alignItems:'center' }}>
                        <Text style={{ fontWeight:'bold',fontSize:16}}>{getPriceVND(Total)+"đ"}</Text>
                        <TouchableOpacity style={styles.btnPayment} onPress={handleCheckPayment}>
                            <Text >Thanh toán</Text>
                        </TouchableOpacity>
                        </View>
                    </View>

                    </View>
                    :
                    <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
                        <Text style={{ fontSize:16 }}>Giỏ hàng của bạn đang trống</Text>
                        <View style={{ flexDirection:'row' }}>
                            <Text>Đặt hàng ngay nào</Text>
                            <TouchableOpacity onPress={()=>navigation.navigate('Home')}>
                                <Text style={{ color:'blue' }}>  trang chủ.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
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
        
    },
    wrapperItem:{
        flex:1,
        flexDirection:'row',
        margin:10,
        backgroundColor:'white',
        padding:10,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
        width: 1,
        height: 1,
        },
        shadowOpacity:  0.4,
        shadowRadius: 3,
        elevation: 5,
    },
    imgItem:{
        width:100,
        height:100,
        borderRadius:15
    },
    descrepItem:{
        paddingLeft:20,
        flex:1,
        justifyContent:'center'
    },
    editAmount:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        borderColor:'gray',
        borderWidth:1,
        width:50,
        height:"80%",
        marginTop:'2%'
    },
    swipeRight:{
        backgroundColor:'red',
        width:80,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        margin:10
    },
    payment:{
        flex:0.1,
        backgroundColor:'white',
        flexDirection:'row',
        padding:10,
        paddingLeft:20,
        justifyContent:'space-between',
    },
    btnPayment:{
        backgroundColor:'tomato',
        padding:10,
        borderRadius:15,
        width:120,
        alignItems:'center'
    },
    groupBtnModal:{
        flexDirection:'row',
        paddingTop:10
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
    }
})