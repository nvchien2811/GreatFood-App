import React,{useEffect} from 'react';
import Home from '../Component/MainScreen/Home';
import FavoriteFood from '../Component/MainScreen/FavoriteFood';
import Person from '../Component/MainScreen/Person';
import Notify from '../Component/MainScreen/Notify';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getAmountFavorite } from '../Contain/getAmount';
import { useSelector,useDispatch } from 'react-redux';

const Tab = createMaterialBottomTabNavigator();

export default function BottomNav(){
    const badgerFavorite = useSelector(e=>e.amountFavorite);
    const dispatch = useDispatch();
    useEffect(() => {
        getAmountFavorite(dispatch);
    }, [])
   
    const handlebadge = (b)=>{
        if(b==0){
            return false;
        }else{
            return b;
        }
    }
    return(
        <Tab.Navigator
            initialRouteName="Home"
            barStyle={{ 
                backgroundColor:'white',
                overflow: 'hidden',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}
            shifting={true}
          
        >
            <Tab.Screen name="Home" component={Home}
                options={{ 
                    tabBarLabel:'Trang chủ',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                      ),
                 }}
            />
             <Tab.Screen name="Favorite" component={FavoriteFood}
                options={{ 
                    tabBarLabel:'Yêu thích',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="favorite-outline" color={color} size={26}  />
                    ),
                    tabBarBadge:handlebadge(badgerFavorite),
                    
                }}
                 
            />
             <Tab.Screen name="Notify" component={Notify}
                options={{ 
                    tabBarLabel:'Thông báo',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="bell-outline" color={color} size={26}  />
                      ),
                   
                 }}
            />
            <Tab.Screen name="Person" component={Person}
                options={{ 
                    tabBarLabel:'Tôi',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="person-outline" color={color} size={26} />
                      ),
                 }}
            />
        </Tab.Navigator>

    )
}

