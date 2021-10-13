import React,{useState,useEffect} from 'react';
import {View,StyleSheet,FlatList,ScrollView} from 'react-native';
import { useSelector } from 'react-redux';
import ItemFood from '../Elements/ItemFood';
import SkeletonItemFood from '../Elements/SkeletonItemFood';
import * as FetchAPI from '../../Utils/fetchData';
export default function Menu({navigation,route}){
    const link = useSelector(s=>s.link);
    const [foodArr,setFoodArr] = useState([]);
    const [loadFood,setLoadFood] = useState(false);
    const {itemId,nameMenu} = route.params;

    useEffect(()=>{
        navigation.setOptions({ title: nameMenu })
        getMenuById();
    },[])
    const getMenuById = async()=>{
        const data = {IDDANHMUC:itemId};
        const res = await FetchAPI.postDataApi(link+"getMonAnByList.php",data);
        setLoadFood(true);
        setFoodArr(res);
    }
    const renderItemFood = ({item})=>{
        return(
           <ItemFood
                navigation={()=>navigation.navigate('Details',{listitem:item})}
                item={item}
                imgheight={150}
           />
        )
    }
    const itemDemo = ()=>{
        return(
            <View style={styles.itemDemo}>
                <SkeletonItemFood/>
            </View>
        )
    }
    return(
        <View style={styles.wrapper}>
            {loadFood ? 
            (
                <FlatList
                    data={foodArr}
                    renderItem={renderItemFood}
                    keyExtractor={item=>item.id}
                    numColumns={2}
                />
            ):(   
                <ScrollView>
                <View style={styles.containerDemo}>
                {itemDemo()}
                {itemDemo()}
                {itemDemo()}
                {itemDemo()}
                </View>
                </ScrollView>
            ) 
        }
           
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper:{
        flex:1,
        width:'100%',
        alignItems:'center',
        justifyContent:'center'
    },
    containerDemo:{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' 
    },
    itemDemo:{
        width: '50%'
    }
    // button: {
    //     alignItems: "center",
    //     backgroundColor: "#DDDDDD",
    //     padding: 10,
    //     marginBottom:10
    // },
   
})