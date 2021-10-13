import React from 'react';
import { FlatList } from 'react-native';
export default function VirtualizedView(props) {
 
    return (
      <FlatList
        bounces={false}
        contentContainerStyle={{ paddingTop:115,elevation:5 }}
        scrollEventThrottle={16}
        data={[]}
        ListEmptyComponent={null}
        keyExtractor={() => "dummy"}
        renderItem={null}
        onScroll={(e)=>{
          // if(e.nativeEvent.contentOffset.y < 50){
          //   props.hideItro(true)
          // }else{
          //   props.hideItro(false)
          // }
          props.setValue(e);
        }}
        
        ListHeaderComponent={() => (
          <React.Fragment>
            {props.children}
          </React.Fragment>
        )}
      />
    );
  }
 