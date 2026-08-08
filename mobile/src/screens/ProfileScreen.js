import React from 'react';
import { View, Text } from 'react-native';
export default function ProfileScreen(){
  return (
    <View style={{flex:1,backgroundColor:'#fff',padding:20}}>
      <Text style={{fontSize:18,fontWeight:'700'}}>بروفايلي</Text>
      <Text style={{marginTop:10}}>عدد المباريات: 12</Text>
      <Text>عدد الأهداف: 20</Text>
      <Text>التقييم: 4.5</Text>
    </View>
  );
}
