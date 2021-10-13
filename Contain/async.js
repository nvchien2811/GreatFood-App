import AsyncStorage from '@react-native-community/async-storage';
import * as FetchAPI from '../Utils/fetchData';

export const checkUser = async()=>{
    const StringUserCurrent = await AsyncStorage.getItem('@user');
    if(StringUserCurrent==null){
        return false;
    }else{
        return true;
    }
}
export const getInfoUser = async(link)=>{
    const StringUserCurrent = await AsyncStorage.getItem('@user');
    const data = {"token":StringUserCurrent};
    const res = await FetchAPI.postDataApi(link+"checkToken.php",data);
    return res;
}