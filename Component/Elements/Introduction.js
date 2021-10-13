import React,{useState} from 'react';
import { StyleSheet,View,Text,StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default function Introduction({navigation}){
  const [show, setshow] = useState(false);
  const slides = [
      {
        key: 'one',
        title: 'Chào mừng đến với GreatFood',
        text: 'Chúng tôi xin hân hạnh chào mừng bạn.\nĐã tải ứng dụng của chúng tôi. \nMong bạn sẽ có những trải nghiệm tuyệt vời',
      //   image: require('./assets/1.jpg'),
        backgroundColor: 'tomato',
      },
      {
        key: 'two',
        title: 'Khám phá',
        text: 'Hãy khám phá những tín năng tuyệt vời có trong ứng dụng di động của nhà hàng chúng tôi.',
      //   image: require('./assets/2.jpg'),
        backgroundColor: '#febe29',
      },
      {
        key: 'three',
        title: 'Bắt đầu trải nghiệm',
        text: 'Bạn đã sẵn sàng để trải nghiệm ứng dụng \n\nBắt đầu ngay nào',
      //   image: require('./assets/3.jpg'),
        backgroundColor: '#22bcb5',
      }
    ];
    _onDoneLoad = ()=>{
      setshow(true);
      setTimeout(()=>{
        _onDone();
      },500)
    }
    _onDone = async() => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        await AsyncStorage.setItem('@introduction','done');
        setshow(false);
        navigation.replace('BottomNav');
        
    }
    _renderItem = ({ item }) => {
        return (
          <View style={[styles.slide,{backgroundColor:item.backgroundColor}]}>
            <Text style={styles.title}>{item.title}</Text>
            {/* <Image source={item.image} /> */}
            <Text style={styles.text}>{item.text}</Text>
          </View>
        );
    }
    return(
        <View style={{ flex:1 }}>
        <StatusBar 
            animated={true}
            translucent backgroundColor="transparent"
            barStyle="dark-content" 
        />
        <AppIntroSlider 
            renderItem={_renderItem} 
            data={slides} 
            onDone={_onDoneLoad}
            skipLabel="Bỏ qua"
            nextLabel="Tiếp tục"
            doneLabel="Bắt đầu"
            showSkipButton
            dotClickEnabled
        />
        <Spinner
          styles={{ flex:1 }}
          visible={show}
        />
        </View>
    )
}
const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
      },
      image: {
        width: 320,
        height: 320,
        marginVertical: 32,
      },
      text: {
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
      },
      title: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
      },
})