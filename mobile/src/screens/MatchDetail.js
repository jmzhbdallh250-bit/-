import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function MatchDetail({ route }) {
  const [match, setMatch] = useState(null);
  const id = route.params?.id;
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:4000/matches/${id}`);
        const data = await res.json();
        setMatch(data);
      } catch (e) { console.error(e); }
    }
    if (id) load();
  }, [id]);

  if(!match) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>جاري التحميل...</Text></View>;
  return (
    <View style={{flex:1,padding:16,backgroundColor:'#fff'}}>
      <Text style={{fontSize:18,fontWeight:'800'}}>{match.title}</Text>
      <Text style={{marginTop:8}}>نوع: {match.type}</Text>
      <Text style={{marginTop:8}}>تاريخ: {new Date(match.scheduledAt).toLocaleString()}</Text>
      <Text style={{marginTop:8,fontWeight:'700'}}>اللاعبون:</Text>
      {match.players.map(p => <Text key={p.id}>{p.userId || 'مفتوح'} - {p.position}</Text>)}
    </View>
  );
}
