import React ,{useState,useEffect}from 'react';
import {View,Text,StyleSheet,FlatList,TouchableOpacity} from 'react-native';
import {SearchBar} from 'react-native-elements';
import { useDispatch,useSelector } from 'react-redux';
import {updateSearchMenu} from '../../Redux/store';
import * as FetchAPI from '../../Utils/fetchData';
import ItemFood from '../Elements/ItemFood';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalDropdown from 'react-native-modal-dropdown';
export default function SearchScreen({navigation}){
    const search = useSelector(s=>s.searchMenu);
    const link = useSelector(s=>s.link);
    const dispatch = useDispatch();
    const [datafull, setdatafull] = useState();
    const [datanew, setdatanew] = useState();
    const [showLoadingSearch, setshowLoadingSearch] = useState(false);
    const [showContent, setshowContent] = useState(false);
    const [showData, setshowData] = useState(false);
    const [isFetching, setisFetching] = useState(false);
    useEffect(()=>{
        navigation.addListener('focus',()=>{
            getFullData()
        })
    },[])
    
    const updateSearch = (e)=>{
        dispatch(updateSearchMenu(e))
    }
    const getFullData = async()=>{
        const res = await FetchAPI.getDataApi(link+"getFullMonAn.php");
        setdatafull(res);
        handleFilterData(res);
    }
    const handleFilterData = (datafull)=>{
        let arrTmp = [];
        datafull.map(e=>{
            if(e.ten.toUpperCase().indexOf(search.toUpperCase())!==-1){
                arrTmp.push(e);
            }
        })
        setdatanew(arrTmp);
        setshowContent(true);
        if(arrTmp.length>0){
            setshowData(true);
        }else{
            setshowData(false);
        }
    }
    const handleSort = (index)=>{
        if(index==0){
            datanew.sort((a,b)=>{
                return a.gia - b.gia;
            })
            
        }else if(index==1){
            datanew.sort((a,b)=>{
                return b.gia - a.gia;
            })
        }else if(index==2){
            datanew.sort((a,b)=>{
                return a.ten.toLowerCase() > b.ten.toLowerCase()
            })
        }else if(index==3){
            datanew.sort((a,b)=>{
                return a.ten.toLowerCase() < b.ten.toLowerCase()
            })
        }
        setisFetching(true);
        setTimeout(()=>{
            setisFetching(false);
        },500)
    }
    const handleSearch = ()=>{
        setshowLoadingSearch(true);
        setTimeout(()=>{
            handleFilterData(datafull);
            setshowLoadingSearch(false);
        },500)
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
            {showContent &&
            <View style={{ flex:1 }}> 
            <View style={styles.searchView}>
                <TouchableOpacity style={{ paddingLeft:10,paddingRight:10 }} onPress={()=>navigation.popToTop()}>
                    <Ionicons name="arrow-back" size={24}/>
                </TouchableOpacity>
                <SearchBar
                   lightTheme
                   placeholder="Tìm kiếm món ăn..."
                   onChangeText={updateSearch}
                   value={search}
                   style={{ height:20 }}
                   inputContainerStyle={{ height: 15,backgroundColor:'white' }}
                   containerStyle={styles.searchContainer}
                   returnKeyType='search'
                   showLoading={showLoadingSearch}
                   onSubmitEditing={handleSearch}
               />
               <ModalDropdown 
                    options={['Gá từ thấp đến cao', 'Giá từ cao đến thấp','Tên từ A -> Z','Tên từ Z -> A']} 
                    style={{ paddingRight:15, paddingLeft:10 }}
                    dropdownStyle={{ width:200}}
                    defaultIndex={-1}
                    dropdownTextStyle={{ fontSize:16,color:'black' }}
                    dropdownTextHighlightStyle={{ color:'red' }}
                    onSelect={(index)=>handleSort(index)}
               >
                    <MaterialCommunityIcons name="filter-outline" size={24}/>
                </ModalDropdown>
            </View>
            {showData ?
                <View style={{ flex:1,backgroundColor:'white' }}>
                    <FlatList
                        renderItem={renderItem}
                        data={datanew}
                        keyExtractor={(item)=>item.id}
                        numColumns={2}
                        refreshing={isFetching}
                    />
                </View>
                :
                <View style={styles.dataNull}>
                    <Text>Không có món ăn nào được tìm thấy...</Text>
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
        alignContent:'center'
    },
    searchContainer:{ 
        backgroundColor:'white', 
        width:"78%",
        height:45,
        borderRadius:8,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,  
    },
    searchView:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        flexDirection:'row',
        paddingBottom:20,
        paddingTop:20,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20
    },
    dataNull:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    }
})