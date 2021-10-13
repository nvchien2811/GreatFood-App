import React from 'react';
import Menu from '../Component/MainScreen/Menu';
import BottomNav from './BottomNav';
import SplashScreen from '../Component/Elements/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsFood from '../Component/MainScreen/DetailsFood';
import Cart from '../Component/MainScreen/Cart'
import Login from '../Component/MainScreen/Login';
import OrderHistory from '../Component/MainScreen/OrderHistory';
import DetailsBill from '../Component/MainScreen/DetailsBill';
import Introduction from '../Component/Elements/Introduction';
import SignUp from '../Component/MainScreen/SignUp';
import SearchScreen from '../Component/MainScreen/SearchScreen';
import PersonInfor from '../Component/MainScreen/PersonInfor';
const Stack = createStackNavigator();

export default function App(){
  return(
    <NavigationContainer>
    <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ 
          headerShown:false
        }}>
      {/* <Stack.Screen name="Home" component={Home} /> */}
      <Stack.Screen name="Splash" component={SplashScreen}/>
      <Stack.Screen name="BottomNav" component={BottomNav}/>
      <Stack.Screen name="Menu" component={Menu} options={{ headerShown:true }}/>
      <Stack.Screen name="Details" component={DetailsFood} />
      <Stack.Screen name="Cart" component={Cart} options={{ headerShown:true,title:'Giỏ hàng'}}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="History" component={OrderHistory} options={{ headerShown:true,title:'Lịch sử hóa đơn'}}/>
      <Stack.Screen name="DetailsBill" component={DetailsBill} options={{ headerShown:true,title:'Chi tiết hóa đơn'}}/>
      <Stack.Screen name="Introduction" component={Introduction} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown:true,title:'Đăng ký GreatFood'}}/>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="PersonInfor" component={PersonInfor} options={{headerShown:true,title:'Thông tin cá nhân'}}/>
    </Stack.Navigator>
    </NavigationContainer>
  )
}