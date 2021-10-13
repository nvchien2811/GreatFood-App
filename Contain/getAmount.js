import { updateAmountCart,updateAmountFavorite } from '../Redux/store';
import AsyncStorage from '@react-native-community/async-storage';

export const getAmountCart = async(dispatch)=>{
    try {
        //get current storage
        const StringCartCurrent = await AsyncStorage.getItem('@cart');
        if(StringCartCurrent==null){
            dispatch(updateAmountCart(0));
            return;
        }
        let arrCartCurrent = JSON.parse(StringCartCurrent);
        dispatch(updateAmountCart(arrCartCurrent.length));
    } catch (error) {
        console.log(error)
    }
     
}
export const getAmountFavorite = async(dispatch)=>{
    try {
        //get current storage
        const StringFavoCurrent = await AsyncStorage.getItem('@favorite');
        if(StringFavoCurrent==null){
            dispatch(updateAmountFavorite(0));
            return;
        }
        let arrFavoCurrent = JSON.parse(StringFavoCurrent);
        dispatch(updateAmountFavorite(arrFavoCurrent.length));
    } catch (error) {
        console.log(error)
    }

}
