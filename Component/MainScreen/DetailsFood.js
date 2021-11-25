import React,{useState,useEffect} from 'react';
import {View,Text,Image,StyleSheet,StatusBar,Dimensions,Share,TouchableOpacity} from 'react-native';
import * as GT from 'react-native-gesture-handler';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import HTML from 'react-native-render-html';
import { useDispatch,useSelector } from 'react-redux';
import { getAmountCart,getAmountFavorite } from '../../Contain/getAmount';
import {getPriceVND} from '../../Contain/getPriceVND';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ModalUse from '../Elements/ModalUse';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import {setHTTP} from '../../Utils/setHTTP';
export default function DetailsFood({route,navigation}){
    const {listitem} = route.params;
    const [amount,setAmount] = useState(1);
    const [statusFavorite,setStatusFavorite] = useState(false);
    const dispatch = useDispatch();
    const [modalVisible,setModalVisible] = useState(false)
    const [modalNotifyVisible,setModalNotifyVisible] = useState(false)
    const link = useSelector(e=>e.link)
    useEffect(()=>{
        getStatusFavorite();
    },[])
    const getStatusFavorite = async()=>{
        //get current storage
        const StringFavoCurrent = await AsyncStorage.getItem('@favorite');
        let arrFavoCurrent = JSON.parse(StringFavoCurrent);
        if(arrFavoCurrent.indexOf(listitem.id)!=-1){
            setStatusFavorite(true);
        }else{
            setStatusFavorite(false);
        }
    }
    const handlePlus= ()=>{
        if(amount!=15){
            let x = amount+1;
            setAmount(x);
        }
    }
    const handleMinus= ()=>{
        if(amount!=1){
            let x = amount-1;
            setAmount(x);
        }
    }
    const handleStatusFavorite = async()=>{
        let tmp = []
        //get current storage
        const StringFavoCurrent = await AsyncStorage.getItem('@favorite');
        let arrFavoCurrent = JSON.parse(StringFavoCurrent); 
        tmp = arrFavoCurrent;
        // AddFavorite
        if(statusFavorite==false){
            try {
                if(arrFavoCurrent==null){
                    tmp.push(listitem.id);
                    setStatusFavorite(true);
                }
                else{
                    tmp.push(listitem.id);
                    setStatusFavorite(true);
                }
            } catch (error) {
                console.log(error)
            }
        }
        // RemoveFavorite
        if(statusFavorite==true){
            try {
                tmp= arrFavoCurrent.filter(e=>e!==listitem.id);
                setStatusFavorite(false);
            } catch (error) {
                console.log(error)
            }
        }
        await AsyncStorage.setItem('@favorite',JSON.stringify(tmp));
        getAmountFavorite(dispatch);
    }
    const handleShare = async()=>{
        try {
            const result = await Share.share({
              message:
                'Món ăn vô cùng tuyệt vời này',
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
          } catch (error) {
            alert(error.message);
          }
    }
    const handelOrder = async()=>{
        // await AsyncStorage.removeItem('@cart');
        let arrTmp = [];
        const StringCartCurrent = await AsyncStorage.getItem('@cart');
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        //Asign arrCartCurrent for arrTmp
        arrTmp = arrCartCurrent;

        // console.log("arr cart current "+ JSON.stringify(arrCartCurrent));
      
        if(arrCartCurrent==null){
            arrTmp = [{id:listitem.id,soluong:amount}]
        }else{
             //check food avalilable 
            let police = arrCartCurrent.some(x => x.id==listitem.id);
            if(police==true){
                //getPostion food current in arr
                let index = arrTmp.findIndex(x=>x.id==listitem.id);
                //setNewAmount
                let newAmount = arrTmp[index].soluong+amount;
                //setAmount
                arrTmp[index].soluong = newAmount;
            }else{
                arrTmp = arrTmp.concat([{id:listitem.id,soluong:amount}]);
            }
        }
        console.log(arrTmp);
        await AsyncStorage.setItem('@cart',JSON.stringify(arrTmp));
        getAmountCart(dispatch);
        setModalVisible(false);
        setModalNotifyVisible(true);
    }
    const ModalNotifyOrder = ()=>(
        <ModalUse
            visible = {modalNotifyVisible}
        >
            <Text style={{ fontWeight:'bold',fontSize:20,paddingBottom:20}}> Đặt món thành công</Text>
            <View style={{ padding:15 }}>
                <Feather name="check-circle" size={60} color={"#009933"} />
            </View>
            <View style={styles.groupBtnModal}>
            <TouchableOpacity style={styles.btnCloseModal} onPress={()=>{setModalNotifyVisible(false);setAmount(1)}}>
                <Text style={{  fontWeight:'bold',color:'white',textAlign:'center' }}>Tiếp tục xem món</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOrderSure} onPress={()=> {navigation.navigate('Cart');setModalNotifyVisible(false)}} >
                <Text style={{ fontWeight:'bold',color:'white',textAlign:'center' }}>Đi đến giỏ hàng</Text>
            </TouchableOpacity>
            </View>
        </ModalUse>
    )
    const ModalOrder = ()=>(
        <ModalUse
            visible = {modalVisible}
        >
            <Text style={{ fontWeight:'bold',fontSize:20,paddingBottom:20}}> Đặt món</Text>
            <Text style={{ fontWeight:'bold',textAlign:'center'}}> Bạn có chắc chắn muốn đặt món ăn </Text>
            <Text style={{ fontWeight:'bold',textAlign:'center',color:'red',paddingBottom:10 }}>{listitem.ten}</Text>
            <Text style={{ fontWeight:'bold',textAlign:'center',paddingBottom:10 }}> Với số lượng là <Text style={{ color:'red' }}>{amount}</Text></Text>
            <Text style={{ fontWeight:'bold',textAlign:'center',paddingBottom:10 }}> Tổng tiền là {getPriceVND(amount*listitem.gia)+ " vnđ"}</Text>
            <View style={styles.groupBtnModal}>

            <TouchableOpacity style={styles.btnCloseModal} onPress={()=>setModalVisible(false)}>
                <Text style={{  color:'white', }}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOrderSure} onPress={handelOrder}>
                <Text style={{  color:'white', }}>Chắc chắn</Text>
            </TouchableOpacity>
            </View>
        </ModalUse>
    )
    const Header = ()=>(
        <View style={styles.headers}>
        <View style={styles.close}>
            <TouchableOpacity style={styles.icon} onPress={()=>navigation.pop()}>
                <Ionicons  name="close" size={18} color="rgba(255,255,255,0.7)"/>
            </TouchableOpacity>
        </View>
            <Image style={styles.img} source={{uri:setHTTP(listitem.hinhanh,link)}}/>
        <View style={styles.share}>
            <TouchableOpacity style={styles.icon} onPress={handleShare}>
                <MaterialIcons  name="share" size={18} color="rgba(255,255,255,0.8)"/>
            </TouchableOpacity> 
        </View>
        </View>

    )
    const BtnFavourite =()=>(
        <View style={styles.wrapperFav}>
        <GT.TouchableOpacity onPress={handleStatusFavorite} style={styles.favorite}>
                {statusFavorite ? 
                <MaterialIcons name="favorite" size={28} color={'white'}/>
                :
                <MaterialIcons name="favorite-border" size={28} color={'white'}/>
                }  
        </GT.TouchableOpacity>
        </View>
    )
    const Content = ()=>(
        <View style={styles.content}>
                <Text style={styles.name}>{listitem.ten}</Text>
                <View style={styles.priceAndAmount}>
                    <Text style={styles.price}>{getPriceVND(listitem.gia)+ "đ/ 1 phần"}</Text>
                <View style={styles.amount}>
                    <TouchableOpacity onPress={handleMinus}>
                        <EvilIcons name="minus" size={30}/>
                    </TouchableOpacity>
                    <Text>{amount}</Text>
                    <TouchableOpacity onPress={handlePlus}>
                        <EvilIcons name="plus" size={30}/>
                    </TouchableOpacity>    
                </View>
                </View>

                <View style={{ paddingBottom:20 }}>
                <HTML 
                    source={{ html: listitem.mota }} 
                    renderers={{
                        video: ({ src }) => (
                            <Video
                                style={{ width: Dimensions.get('window').width - 30 }}
                                source={{ uri: src }}
                            />
                        ),
                    }} 
                    contentWidth={Dimensions.get('window').width}
                    ignoredTags={IGNORED_TAGS.filter(tag => tag !== 'video')}
                />
                </View>
    
        </View>
    )
    
    return (
        <View  style={styles.wrapper}>
            <ModalOrder/>
            <ModalNotifyOrder/>
            <ParallaxScrollView
                // parallaxBackgroundScrollSpeed={5}
                // parallaxForegroundScrollSpeed={2.5}
                // keyboardShouldPersistTaps='always'
                contentBackgroundColor="white"
                parallaxHeaderHeight={280}
                renderForeground={() => (
                    <Header/>
                )}
            >
                <View style={{ flex:1 }}>
                    <StatusBar  
                        animated={true}
                        translucent backgroundColor="transparent"
                        barStyle="dark-content"
                    />
                    <Content/>
                  
                    <BtnFavourite/>
                </View>
            </ParallaxScrollView>
            <View style={styles.wrapperBtnOrder}>
                <TouchableOpacity onPress={()=>setModalVisible(true)} style={styles.btnOrder}>
                    <Text style={styles.textBtnOrder}>Đặt món ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1
    },
    img:{
        width:'100%',
        height:Dimensions.get('window').height/2.5,
       
    },
    name:{
        fontSize:18,
        fontWeight:'bold'
    },
    price:{
        paddingTop:10
    },
    priceAndAmount:{ 
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center' }
    ,
    amount:{
        flexDirection:'row'
    },
    wrapperFav:{
        position:'absolute',
        marginTop: -50,
        right:40,
    },
    favorite:{
        borderRadius:40,
        backgroundColor:'#EE3169',
        padding:10,
        zIndex: 10,
        elevation: 2, 
    },
    content:{
        flex:1,
        overflow: 'hidden',
        backgroundColor:'white',
        padding:20,
        flexDirection:'column',
        marginTop:-30,
        // borderRadius:80
        borderTopLeftRadius:30,
        borderTopRightRadius:30
    },
    close:{
        position:'absolute',
        top:50,
        left:30,
        zIndex:90,
    },
    share:{
        position:'absolute',
        top:50,
        right:30,
        zIndex:90,
    },
    icon:{
        borderRadius:20,
        backgroundColor: 'rgba(60, 60, 60, 0.6)',
        padding:6
    },
    wrapperBtnOrder:{
        position:'absolute',
        width:'100%',
        alignItems:'center',
        bottom:0,
        marginBottom:10,
    },
    btnOrder:{
        backgroundColor:'red',
        borderRadius: 30,
        padding:10,
        width:Dimensions.get('window').width/2,
    },
    textBtnOrder:{
        color:'white',
        textAlign:'center',
        fontWeight:'bold' 
    },
    groupBtnModal:{
        flexDirection:'row',
    },
    btnCloseModal:{
        backgroundColor:'red',
        padding:10,
        borderRadius:15,
        width:100,
        alignItems:'center'
    },
    btnOrderSure:{
        backgroundColor:'blue',
        padding:10,
        borderRadius:15,
        marginLeft:20,
        width:100,
        alignItems:'center'
    }
})