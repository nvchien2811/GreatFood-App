import React,{useEffect,useState} from 'react';
import { View,Text,FlatList,StyleSheet,TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import ItemFood from '../Elements/ItemFood';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as FetchAPI from '../../Utils/fetchData';
export default function FavoriteFood({navigation}){
    const link = useSelector(e=>e.link);
    const [dataFavoriteFood,setDataFavoriteFood] = useState();
    const [visibleContent, setvisibleContent] = useState(false);
    const [showFavorEmpty, setshowFavorEmpty] = useState(false);
    useEffect(()=>{
        navigation.addListener('focus',()=>{
            setvisibleContent(false);
            getFavorite();
        })
    },[])

    const getFavorite = async()=>{
        //arrtmp
        let arrTmp = [];
        //get current storage
        const StringFavoCurrent = await AsyncStorage.getItem('@favorite');
        let arrFavoCurrent = JSON.parse(StringFavoCurrent);
        if(arrFavoCurrent==null){
            setDataFavoriteFood(arrTmp);
            setvisibleContent(true);
            setshowFavorEmpty(true);
        }else{
            if(arrFavoCurrent.length==0){
                setDataFavoriteFood(arrTmp);
                setvisibleContent(true);
                setshowFavorEmpty(true);
            }else{
                setshowFavorEmpty(false);
                for(var i=0;i<arrFavoCurrent.length;i++){
                    const data = { "IDMONAN":arrFavoCurrent[i],"SOLUONG":null};
                    const res = await FetchAPI.postDataApi(link+"getMonAnById.php",data)
                    arrTmp.push(res);  
                    if(i==arrFavoCurrent.length-1){
                        setDataFavoriteFood(arrTmp);
                        setvisibleContent(true);
                    }
                }
            } 
        }
    }
    const renderItem = ({item})=>{
        return(
            <ItemFood
                navigation={()=>navigation.navigate('Details',{listitem:item})}
                item={item}
                imgheight={150}
            />
         )
    }
    return(
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <Text style={{ fontWeight:'bold',fontSize:18 }}>Danh sách món ăn yêu thích</Text>
                <MaterialIcons style={{ paddingLeft:10 }} name="favorite-outline" size={24}/>
            </View>
            {visibleContent &&
            <View style={{ flex:1 }}>
                {!showFavorEmpty ?
                <View style={{ flex:1 }}>
                    <FlatList
                        data={dataFavoriteFood}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={2}
                    />
                </View>
                :
                <View style={{ flex:1,justifyContent:'center',alignItems:'center' }}>
                        <Text style={{ fontSize:16 }}>Bạn chưa có món ăn yêu thích nào</Text>
                        <View style={{ flexDirection:'row' }}>
                            <Text>Hãy xem và chọn món ăn mà bạn yêu thích</Text>
                            <TouchableOpacity onPress={()=>navigation.navigate('Home')}>
                                <Text style={{ color:'blue' }}>  trang chủ.</Text>
                            </TouchableOpacity>
                        </View>
                </View>
                }
            </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        backgroundColor:'white',
    },
    header:{
        flex:0.1,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        alignItems:'center',
        flexDirection:'row',
        paddingLeft:15,
    }
})