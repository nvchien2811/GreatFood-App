import React ,{useEffect,useState} from 'react';
import {View,Text,StyleSheet,FlatList,Image,TouchableOpacity} from 'react-native';
import {getPriceVND} from '../../Contain/getPriceVND';
import { useSelector } from 'react-redux';
import * as FetchAPI from '../../Utils/fetchData';
import ModalUse from '../Elements/ModalUse';
import Spinner from 'react-native-loading-spinner-overlay';
import {setHTTP} from '../../Utils/setHTTP';
export default function DetailsBill({route,navigation}){
    const link = useSelector((e)=>e.link);
    const [dataFood, setdataFood] = useState();
    const [status, setstatus] = useState(false);
    const [opacityBtnRemove, setopacityBtnRemove] = useState(1);
    const [showModalAskRemove, setshowAskModalRemove] = useState(false);
    const [showSpinner, setshowSpinner] = useState(false);
    const {itemBill} = route.params;
    useEffect(() => {
        getFood();
        getStatus();
    }, []);
    const getFood = async()=>{
        let arr = [];
        let mang = itemBill.mangmonan;
        const arrTmp = JSON.parse(mang);
        for(let i=0;i<arrTmp.length;i++){
            const data = { "IDMONAN":arrTmp[i].id,"SOLUONG":arrTmp[i].soluong};
            const res = await FetchAPI.postDataApi(link+"getMonAnById.php",data);
            arr = arr.concat(res);
            if(i==arrTmp.length-1){
                setdataFood(arr);
               
            }
        }
    }
    const getStatus = ()=>{
        if(itemBill.status==0){
            setstatus(false);
            setopacityBtnRemove(1);
        }else{
            setstatus(true);
            setopacityBtnRemove(0.5);
        }
    }
    const handleRemoveBill = async()=>{
        setshowSpinner(true);
        setshowAskModalRemove(false);
        const data = {"IDHOADON":itemBill.idhoadon};
        const res = await FetchAPI.postDataApi(link+"removeBill.php",data);
        console.log(res.result);
        if(res.result=="successfully"){
            navigation.replace('History');
            setshowSpinner(false);
        }else{
            console.log("Có lỗi rồi")
            setshowSpinner(false);
        }
    }
    const ModalAskRemove = ()=>{
        return(
            <ModalUse
                visible={showModalAskRemove}
            >
                <View>
                    <Text style={{ textAlign:'center' }}>Bạn có chắc chắn muốn xóa hủy đơn hàng này không?</Text>
                </View>
                <View style={styles.groupBtn}>
                    <TouchableOpacity style={styles.btnBack} onPress={()=>setshowAskModalRemove(false)} >
                        <Text style={{  color:'white', }}>Để sau</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnRemoveBill} onPress={handleRemoveBill}>
                        <Text style={{  color:'white', }}>Chắc chắn</Text>
                    </TouchableOpacity>
                </View>
            </ModalUse>
        )
    }
    const renderItemFood = ({item})=>{
        return(
            <View style={styles.wrapperItemFood}>
                <View>
                    <Image source={{ uri:setHTTP(item.hinhanh,link) }} style={styles.imgItemFood}/>
                </View>
                <View style={styles.groupNamePrice}>
                    <Text style={{ fontWeight:'bold' }}>{item.ten}</Text>
                    <Text>{getPriceVND(item.gia*item.soluong)+ "đ"}</Text>
                </View>
                <View style={styles.itemAmount}>
                    <Text>X {item.soluong}</Text>
                </View>
            </View>
        )
    }
    return(
        <View style={styles.wrapper}>
            <ModalAskRemove/>
            <View style={styles.content}>
                    <View style={styles.wrapperDes}>
                        <Text style={styles.textDesBill}>Mã hóa đơn :</Text>
                        <Text>{itemBill.idhoadon}</Text>
                    </View>
                    <View  style={styles.wrapperDes}>
                        <Text style={styles.textDesBill}>Ngày đặt :</Text>
                        <Text>{itemBill.datedat}</Text>
                    </View>
                    <View style={styles.wrapperDes}>
                        <Text  style={styles.textDesBill}>Tổng tiền :</Text>
                        <Text>{getPriceVND(itemBill.tongtien)+" đ"}</Text>
                    </View>
                    <Text  style={[styles.textDesBill,{marginTop:10}]}>Chi tiết món ăn</Text>
                  
                </View>
                <View style={{ flex:1,paddingTop:4 }}>
                        <FlatList
                            data={dataFood}
                            renderItem={renderItemFood}
                            keyExtractor={(item)=>item.id}
                        />
                </View>
                <View style={styles.groupBtn}>
                    <TouchableOpacity style={styles.btnBack} onPress={()=>navigation.pop()} >
                        <Text style={{  color:'white', }}>Trở về</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnRemoveBill,{opacity:opacityBtnRemove}]} disabled={status} onPress={()=>setshowAskModalRemove(true)}>
                        <Text style={{  color:'white', }}>Hủy đơn</Text>
                    </TouchableOpacity>
                </View>
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
        padding:15
    },
    textDesBill:{
        fontWeight:'bold',
        fontSize:16
    },
    wrapperDes:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:10
    },
    wrapperItemFood:{
        flex:1,
        backgroundColor:'white',
        padding:10,
        flexDirection:'row',
        borderRadius:15,
        marginTop:10
    },
    imgItemFood:{
        width:100,
        height:100,
        borderRadius:15 
    },
    groupNamePrice:{
        paddingLeft:10,
        justifyContent:'space-evenly'
    },
    itemAmount:{
        flex:1,
        justifyContent:'center',
        alignItems:'flex-end',
        paddingRight:10 
    },
    groupBtn:{
        width:'100%',
        flexDirection:'row',
        paddingTop:10,
        justifyContent:'center',
        bottom:0
    },
    btnBack:{
        backgroundColor:'red',
        padding:10,
        borderRadius:15,
        width:100,
        alignItems:'center',
        justifyContent:'center'
    },
    btnRemoveBill:{
        backgroundColor:'blue',
        padding:10,
        borderRadius:15,
        marginLeft:20,
        width:100,
        justifyContent:'center',
        alignItems:'center'
    }
})