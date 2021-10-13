import React ,{useEffect,useState}from 'react';
import {View,Text,StyleSheet,FlatList,TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux';
import {getInfoUser} from '../../Contain/async';
import * as FetchAPI from '../../Utils/fetchData';
import { getPriceVND } from '../../Contain/getPriceVND';
import { Tab } from 'react-native-elements';

export default function OrderHistory({navigation}){
    const link = useSelector(s=>s.link);
    const [dataBillHistory, setdataBillHistory] = useState();
    const [index, setIndex] = useState();
    const [dataFull, setdataFull] = useState();
    useEffect(()=>{
        getBillHistory();
    },[])
    const getBillHistory = async()=>{
        const user = await getInfoUser(link);
        const idUser = user.id;
        const data = {
            "IDUSER":idUser
        }
        const res = await FetchAPI.postDataApi(link+"getBillCustomers.php",data);
        res.sort((a, b) =>
        b.datedat.split('/').reverse().join().localeCompare(a.datedat.split('/').reverse().join()));

        setdataBillHistory(res);
        setdataFull(res);
    }
    const renderItemBill = ({item})=>{
        return(
            <TouchableOpacity onPress={()=>navigation.navigate("DetailsBill",{itemBill:item})}>
            <View style={styles.wrapperItemBill}>
                <View style={styles.content}>
                    <View style={{ flexDirection:'row' }}>
                        <Text style={styles.textDesBill}>Mã hóa đơn :</Text>
                        <Text>{item.idhoadon}</Text>
                    </View>
                    <View style={{ flexDirection:'row' }}>
                        <Text style={styles.textDesBill}>Ngày đặt :</Text>
                        <Text>{item.datedat}</Text>
                    </View>
                    <View style={{ flexDirection:'row' }}>
                        <Text  style={styles.textDesBill}>Tổng tiền :</Text>
                        <Text>{getPriceVND(item.tongtien)+" đ"}</Text>
                    </View>
                </View>
                <View style={styles.wrapperStatus}>
                    {item.status==1 ?
                    <Text style={{ color:'green' }}>Đã hoàn thành</Text>
                    :
                    <Text style={{ color:'red' }}>Đang xử lý</Text>
                    }
                    
                </View>
            </View>
            </TouchableOpacity>
        )
    }
    const handleSetIndex = (e)=>{
        try {
            let arrTmp = [];
            setIndex(e);
            if(e==1){
                dataFull.map((e)=>{
                    if(e.status==0){
                        arrTmp.push(e);
                    }
                })
            }else if(e==2){
                dataFull.map((e)=>{
                    if(e.status==1){
                        arrTmp.push(e);
                    }
                })
            }else{
                dataFull.map((e)=>{
                    arrTmp.push(e)
                })
            }
            setdataBillHistory(arrTmp);
        } catch (error) {
            
        }
    }
    return(
        <View style={styles.wrapper}>

            <Tab value={index} onChange={handleSetIndex} indicatorStyle={{ backgroundColor:'blue' }} >
                <Tab.Item title="Tất cả" />
                <Tab.Item title="Đang xử lý" />
                <Tab.Item title="Đã hoàn thành" />
            </Tab>
            <FlatList 
                data={dataBillHistory}
                renderItem={renderItemBill}
                keyExtractor={(item)=>item.idhoadon}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        justifyContent:'space-between'
    },
    wrapperItemBill:{
        flex:1,
        height:80,
        backgroundColor:'white',
        marginTop:10,
        padding:10,
        flexDirection:'row'
    },
    textDesBill:{
        fontWeight:'bold'
    },
    wrapperStatus:{
        flex:1,
        justifyContent:'center',
        alignItems:'flex-end',
        paddingRight:15
    }
})