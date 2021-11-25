import React,{useState,useEffect,useRef} from 'react'; 
import {View,Text,FlatList,StyleSheet,ScrollView,Image,StatusBar,TouchableOpacity,Dimensions,Button,Animated} from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import { SearchBar,Badge } from 'react-native-elements';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SkeletonItemFood from '../Elements/SkeletonItemFood';
import ItemFood from '../Elements/ItemFood';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VirtualizedView from '../Elements/VirtualizedView';
import Spinner from 'react-native-loading-spinner-overlay';
import {updateSearchMenu} from '../../Redux/store';
import {getAmountCart} from '../../Contain/getAmount';
import * as FetchAPI from '../../Utils/fetchData';
import {setHTTP} from '../../Utils/setHTTP';
import { checkUser } from '../../Contain/async';

export default function Home({navigation}){
  // const [search,setSearch] = useState('');
  const [dataMenu,setDataMenu] = useState([]);
  const [dataFoodHighLight,setDataFoodHighLight] = useState([]);
  const [dataFoodNew,setDataFoodNew] = useState([]);
  const link = useSelector(state=>state.link);
  const [visbleItem,setVisibleItem] = useState(false);
  const [visbleItemFood,setVisibleItemFood] = useState(false);
  const [visbleItemFoodNew,setVisibleItemFoodNew] = useState(false);
  const [pageFoodHighLight,setPageFoodHighLight] = useState(1);
  const [show,setShow] = useState(false);
  const [showIntro,setShowIntro] = useState(true);
  const [showLoadingSearch, setshowLoadingSearch] = useState(false);
  const search = useSelector(state=>state.searchMenu);
  const badgeCart = useSelector(state=>state.amountCart)
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  //Animation header
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY,0,50);
  const translateY = diffClamp.interpolate({
    inputRange:[0,50],
    outputRange:[0,-50]
  })
 //Animation header

  useEffect(()=>{
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver:true
    }).start();
    getFoodHighLight(pageFoodHighLight);
    getMenu();
    getFoodNew();
    getAmountCart(dispatch);
  
  },[])
 
  const handlebadge = (b)=>{
      if(b==0){
          return false;
      }else{
          return b;
      }
  }
  const getMenu = async()=>{
    try {
      const res = await FetchAPI.getDataApi(link+"getdanhmuc.php");
      if(res!==undefined){
        setVisibleItem(true);
        setDataMenu(res);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getFoodNew = async()=>{
    try {
      const res = await FetchAPI.getDataApi(link+"getFullMonAn.php");
      if(res!==undefined){
        res.sort((a, b) =>
        b.AddDate.split('/').reverse().join().localeCompare(a.AddDate.split('/').reverse().join())
        );
        setNew(res);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getFoodHighLight = async(p)=>{
    try {
      const res = await FetchAPI.getDataApi(link+"getFoodHighLight.php?trang="+p);
      if(res!==undefined){
        setDataFoodHighLight(res);
        if(p!=1){
            setDataFoodHighLight(dataFoodHighLight.concat(res));
        }
        setVisibleItemFood(true);
        setShow(false);
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const setNew = (arr)=>{
    let arrTemp = [];
    for(var i=0;i<arr.length;i++){
      if(i==4){
        setDataFoodNew(arrTemp);
        setVisibleItemFoodNew(true);
        break;
      }
      else{
        arrTemp = arrTemp.concat(arr[i]);
      }
    }
  }

  const handleMoreHighLight = ()=>{
    setShow(true);
    setPageFoodHighLight(pageFoodHighLight+1);
    getFoodHighLight(pageFoodHighLight+1);
  }
  const handleHideHighLight = ()=>{
    setShow(true);
    setPageFoodHighLight(1);
    getFoodHighLight(1);
  }
 
  const handleUser = async()=>{
    const s = await checkUser();
    if(s){
      navigation.navigate("Person");
    }else{
      navigation.navigate("Login");
    }
  }
  const updateSearch = (search)=>{
    dispatch(updateSearchMenu(search))
  }
  const handleSearch = ()=>{
    setshowLoadingSearch(true);
    setTimeout(()=>{
      navigation.navigate("Search");
      setshowLoadingSearch(false);
    },1000)
  }

  const handleSetValueScrollY = (e)=>{
    if(e.nativeEvent.contentOffset.y<0){
      scrollY.setValue(0)
    }else{
      scrollY.setValue(e.nativeEvent.contentOffset.y)
    } 
  }

  const handleIntro = (e)=>{
    setShowIntro(e);
  }

  const renderItem = ({item})=>{
    return(
      <TouchableOpacity onPress={()=>navigation.navigate('Menu',{itemId:item.iddanhmuc,nameMenu:item.tendanhmuc})} style={styles.wrapperitemMenu} >
        <View>
            <Image  style={ styles.imgItemMenu } source={{ uri:setHTTP(item.hinhanh,link) }} />
            <Text style={{ paddingTop:5,textAlign:'center' }}>{item.tendanhmuc}</Text> 
        </View>  
      </TouchableOpacity>
    )
  }
  const renderItemFood = ({item})=>{
    return(
      <View style={{ width:Dimensions.get('window').width/2.3 }}>
        <ItemFood
              navigation={()=>navigation.navigate('Details',{listitem:item})}
              item={item}
              imgheight={110}
        />
      </View>
    )
  }
  const itemMenuDemo = ()=>{
    return(
        <View style={styles.wrapperitemMenu}>
        <SkeletonPlaceholder>
              <View  style={styles.imgItemMenu }  />
              <View style={{marginTop:5,width:100,height:20}}/>
        </SkeletonPlaceholder>
        </View>
    )
  }
  const itemFoodDemo = ()=>{
    return(
        <View style={styles.itemFoodDemo}>
            <SkeletonItemFood/>
        </View>
    )
  }
  const IntroTop = ()=>(
    <Animated.View style={styles.introTop}>
      <Animated.Text style={{ fontWeight:'bold',fontSize:22,color:'tomato',opacity:fadeAnim }}>GreatFood</Animated.Text>
      <Animated.View style={{ flexDirection:'row',opacity:fadeAnim }}>
        <TouchableOpacity onPress={handleUser}>
          <Ionicons style={styles.iconTop} name="person-circle-outline" size={26}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Cart')}>
          <Ionicons style={styles.iconTop} name="cart-outline" size={26}/>
          {badgeCart!==0 &&
            <Badge value={handlebadge(badgeCart)} status="error" containerStyle={styles.badge} />
          }
        </TouchableOpacity>
      </Animated.View>
  </Animated.View>
  )
  return(
    <View style={styles.wrapper} >
      <StatusBar 
        animated={true}
        backgroundColor="white"
        barStyle="dark-content" 
      />
      <Animated.View  
          style={{
            transform:[{translateY:translateY}], 
            position:'absolute',
            top:0,
            left:0,
            right:0,
            zIndex:1
          }} 
      >
        {/* IntoTop */}
        <IntroTop/>
        {/* IntoTop */}

        {/* SearchView */}
        <View style={styles.searchView}>
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
          {!showIntro &&
          <View style={{ paddingLeft:10 }}>
            <TouchableOpacity onPress={()=>navigation.navigate('Cart')}>
                  <Ionicons style={styles.iconTop} name="cart-outline" size={26}/>
                  {badgeCart!==0 &&
                  <Badge value={handlebadge(badgeCart)} status="error" containerStyle={styles.badge} />
                  }
            </TouchableOpacity>
          </View>
          } 
        </View> 
        {/* SearchView */}
    </Animated.View>

  
      
    <VirtualizedView 
      hideItro={handleIntro} 
      setValue={handleSetValueScrollY}
    >
    <View style={styles.wrapper}>
      
      <View style={{overflow:'hidden',paddingBottom: 5}}>
      <View style={styles.headers}>
      {/* Danh mục */}
      <View style={styles.menu}>
        <Text style={{ fontSize:18 }}>Danh mục</Text>
        {visbleItem ? 
              <FlatList 
                horizontal
                data={dataMenu}
                renderItem={renderItem}
                keyExtractor={item => item.iddanhmuc}
              />  
              :
              <ScrollView horizontal>
                <View style={{ flexDirection:'row' }}>
                {itemMenuDemo()}
                {itemMenuDemo()}
                {itemMenuDemo()}
                {itemMenuDemo()}
                </View>
              </ScrollView>

        }
      </View> 
      {/* Danh mục */}

      </View>
      </View>
    
      <View style={styles.body}>
        {/* Món ăn nổi bật */}
        <View style={{ flexDirection:'row',justifyContent:'space-between' }}>
        <Text style={{ fontSize:18,fontWeight:'bold' }}>Món ăn bán chạy</Text>
        <TouchableOpacity style={{ justifyContent:'center' }} onPress={handleMoreHighLight}>
          <Text style={{ textDecorationLine:'underline',color:'blue',paddingRight:10 }}>{"Xem thêm >>>"} </Text>
        </TouchableOpacity>
        </View>
        {visbleItemFood ? 
            <View>
            <FlatList  
             data={dataFoodHighLight}
             renderItem={renderItemFood}
             keyExtractor={item=> item.id}
             numColumns={2}
            //  onRefresh={handleMoreHighLight}
            //  onEndReached={handleMoreHighLight}
            />  
            {pageFoodHighLight!=1 &&
             <View style={{ flexDirection:'row',justifyContent:'space-evenly' }}>
              <Button onPress={handleMoreHighLight} title="Xem thêm ..."/>
              <Button color="#AA0000" onPress={handleHideHighLight} title="Ẩn bớt"/>
            </View>
            }
            </View>
            :
            <View style={styles.containerFoodDemo}>
            {itemFoodDemo()}
            {itemFoodDemo()}
            </View>
        }
        {/* Món ăn nổi bật */}

        {/* Món ăn mới nhất */}
        <Text style={{ paddingTop:10,fontSize:18,fontWeight:'bold' }}>Món ăn mới nhất</Text>
        {visbleItemFoodNew ? 
          <FlatList  
              data={dataFoodNew}
              renderItem={renderItemFood}
              listKey={(item, index) =>`_key${index.toString()}`}
              keyExtractor={item=> item.id}
              numColumns={2}
          />
          :
          <View style={styles.containerFoodDemo}>
          {itemFoodDemo()}
          {itemFoodDemo()}
          </View>
        }
      </View> 

   
    </View>
    </VirtualizedView>
    <Spinner
          styles={{ flex:1 }}
          visible={show}
    />
    </View>
  )
}
const styles = StyleSheet.create({
  wrapper:{
    flex:1,
    backgroundColor:'#F6F9FA',
    width:'100%',
    height:'100%',
  },
  introTop:{
    backgroundColor:'white',
    height:50,
    padding:10,
    paddingLeft:20,
    flexDirection:'row',
    justifyContent:'space-between',
    zIndex:1,
  },
  iconTop:{
    paddingRight:18
  },
  badge:{
    position:'absolute',
    left:20,
    top:-8
  },
  headers:{
    backgroundColor:'white',
    height:240,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity:  0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginBottom:10
  },
  searchContainer:{ 
    backgroundColor:'white', 
    width:'90%',
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
    padding:10,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    flexDirection:'row',
  },
  menu:{
    padding: 10,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
  },
  wrapperitemMenu:{
    backgroundColor:'white',
    marginLeft:10,
    margin:5,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    padding: 15,
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
  imgItemMenu:{
    width:100,
    height:100,
    borderRadius:5
  },
  body:{
    flex:1,
    padding:8
  },
  containerFoodDemo:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  itemFoodDemo:{
      width: '50%'
  },
  
})