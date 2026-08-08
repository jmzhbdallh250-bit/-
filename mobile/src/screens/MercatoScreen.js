import React from 'react';
import { View, Text } from 'react-native';
export default function MercatoScreen(){
  return (
    <View style={{flex:1,backgroundColor:'#fff',padding:20}}>
      <Text style={{fontSize:18,fontWeight:'700'}}>الميركاتو</Text>
      <Text style={{marginTop:10}}>لوحة الإعلانات للفرق التي تبحث عن لاعبين</Text>
    </View>
  );
}
