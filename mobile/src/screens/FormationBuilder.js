import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Modal } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, useAnimatedGestureHandler } from 'react-native-reanimated';

const API = 'http://localhost:4000'; // عدّل للـ LAN عند الحاجة

// sample players (seed) -- in الواقع تجلب من API للمستخدم
const samplePlayers = [
  { id: 'p1', name: 'أحمد', positionPref: 'FW' },
  { id: 'p2', name: 'محمود', positionPref: 'MF' },
  { id: 'p3', name: 'علي', positionPref: 'DEF' },
  { id: 'p4', name: 'سالم', positionPref: 'GK' },
  { id: 'p5', name: 'مريم', positionPref: 'MF' },
  { id: 'p6', name: 'ياسر', positionPref: 'FW' },
  { id: 'p7', name: 'حسين', positionPref: 'DEF' },
];

function formationSlotsFor(type, formationString) {
  let rows = [];
  if (type === 'FIVE') {
    rows = [
      [{ label: 'GK' }],
      [{ label: 'DEF' }, { label: 'DEF' }],
      [{ label: 'MID' }, { label: 'FWD' }]
    ];
  } else if (type === 'SEVEN') {
    rows = [
      [{ label: 'GK' }],
      [{ label: 'DEF' }, { label: 'DEF' }],
      [{ label: 'MID' }, { label: 'MID' }, { label: 'MID' }],
      [{ label: 'FWD' }]
    ];
  } else {
    rows = [
      [{ label: 'GK' }],
      [{ label: 'DEF' }, { label: 'DEF' }, { label: 'DEF' }, { label: 'DEF' }],
      [{ label: 'MID' }, { label: 'MID' }, { label: 'MID' }],
      [{ label: 'FWD' }, { label: 'FWD' }, { label: 'FWD' }]
    ];
  }

  const slots = [];
  const totalRows = rows.length;
  rows.forEach((row, rIdx) => {
    const cols = row.length;
    row.forEach((cell, cIdx) => {
      const x = (cIdx + 0.5) / cols; // normalized
      const y = (rIdx + 0.5) / totalRows;
      slots.push({ id: `r${rIdx}c${cIdx}`, slotIndex: slots.length, x, y, position: cell.label });
    });
  });
  return slots;
}

export default function FormationBuilder({ navigation, route }) {
  const draft = route.params?.draft || { title: 'مباراة', type: 'SEVEN', formation: 'auto', scheduledAt: new Date().toISOString() };
  const [type, setType] = useState(draft.type || 'SEVEN');
  const [formation, setFormation] = useState(draft.formation || 'auto');
  const [slots, setSlots] = useState([]);
  const [assigned, setAssigned] = useState({}); // slotId -> player
  const [players, setPlayers] = useState(samplePlayers);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [pickSlotModal, setPickSlotModal] = useState(false);

  useEffect(() => {
    const s = formationSlotsFor(type, formation);
    setSlots(s);
    setAssigned({});
  }, [type, formation]);

  function assignToSlot(slotId, player) {
    setAssigned(prev => {
      const copy = {...prev};
      Object.keys(copy).forEach(k => { if (copy[k]?.id === player.id) delete copy[k]; });
      copy[slotId] = player;
      return copy;
    });
  }

  function removeFromSlot(slotId) {
    setAssigned(prev => {
      const copy = {...prev};
      delete copy[slotId];
      return copy;
    });
  }

  async function saveMatch() {
    const playersList = Object.keys(assigned).map(k => {
      const slot = slots.find(s => s.id === k);
      const p = assigned[k];
      return { userId: p.id, slotIndex: slot.slotIndex, position: slot.position };
    });
    const payload = {
      title: draft.title,
      venueId: draft.venueId || null,
      type,
      formation: formation === 'auto' ? 'auto' : formation,
      scheduledAt: draft.scheduledAt,
      creatorId: 'demo-creator-id',
      players: playersList
    };

    try {
      const res = await fetch(`${API}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data?.id) {
        navigation.replace('MatchDetail', { id: data.id });
      } else {
        alert('حدث خطأ في حفظ المباراة');
      }
    } catch (e) {
      console.error(e);
      alert('خطأ في الاتصال بالخادم');
    }
  }

  const { width } = Dimensions.get('window');
  const fieldWidth = width - 160;
  const fieldHeight = Math.round(fieldWidth * 1.6);

  return (
    <View style={{flex:1,flexDirection:'row',backgroundColor:'#fff'}}>
      <View style={{width:140,padding:12,borderRightWidth:1,borderColor:'#f0f0f0'}}>
        <Text style={{fontWeight:'800',marginBottom:8}}>اللاعبون</Text>
        <FlatList
          data={players}
          keyExtractor={p => p.id}
          renderItem={({item}) => {
            const isAssigned = Object.values(assigned).some(a => a?.id === item.id);
            return (
              <TouchableOpacity onPress={() => setSelectedPlayer(item)} style={[styles.playerItem, isAssigned && {opacity:0.6}]}>
                <Text style={{fontWeight:'700'}}>{item.name}</Text>
                <Text style={{color:'#666'}}>{item.positionPref}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <TouchableOpacity style={{marginTop:12,backgroundColor:'#eafaf2',padding:10,borderRadius:8,alignItems:'center'}} onPress={saveMatch}>
          <Text style={{color:'#007A3D',fontWeight:'700'}}>حفظ المباراة</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex:1,alignItems:'center',padding:12}}>
        <View style={{width:fieldWidth, height:fieldHeight, backgroundColor:'#e8f7e8', borderRadius:12, position:'relative', overflow:'hidden', borderWidth:1, borderColor:'#dcefe0', justifyContent:'center', alignItems:'center'}}>
          <Text style={{position:'absolute', top:8, fontWeight:'700', color:'#2d6a38'}}>ملعب - {type === 'FIVE' ? 'خماسي' : type === 'SEVEN' ? 'سباعي' : '11'}</Text>
          {slots.map(s => {
            const left = s.x * (fieldWidth - 60);
            const top = s.y * (fieldHeight - 40);
            const assignedPlayer = assigned[s.id];
            return (
              <TouchableOpacity key={s.id} onPress={() => {
                if (selectedPlayer) { assignToSlot(s.id, selectedPlayer); setSelectedPlayer(null); }
                else { setPickSlotModal(true); setSelectedPlayer(null); }
              }} style={[styles.slot, { left, top, position:'absolute' }]}>
                <Text style={{fontSize:10,fontWeight:'700'}}>{s.position}</Text>
                <Text style={{fontSize:12}}>{assignedPlayer ? assignedPlayer.name : '+'}</Text>
                {assignedPlayer && <TouchableOpacity onPress={() => removeFromSlot(s.id)} style={styles.removeBtn}><Text style={{color:'#fff'}}>×</Text></TouchableOpacity>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Modal visible={!!selectedPlayer} transparent animationType="slide">
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={{fontWeight:'800', marginBottom:8}}>تعيين {selectedPlayer?.name} إلى فتحة</Text>
            <FlatList
              data={slots}
              keyExtractor={s => s.id}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => { assignToSlot(item.id, selectedPlayer); setSelectedPlayer(null); }} style={styles.slotOption}>
                  <Text>{item.position} — فتحة {item.slotIndex + 1}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setSelectedPlayer(null)} style={{marginTop:8,alignItems:'center'}}><Text style={{color:'#777'}}>إلغاء</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  playerItem:{padding:8, borderRadius:8, backgroundColor:'#fff', marginBottom:8, borderWidth:1, borderColor:'#f0f0f0'},
  slot:{ width:60, height:40, backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#dfe', alignItems:'center', justifyContent:'center' },
  removeBtn:{ position:'absolute', top:-8, right:-8, backgroundColor:'#e74c3c', width:20, height:20, borderRadius:10, alignItems:'center', justifyContent:'center' },
  modalWrap:{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center'},
  modal:{width:'80%',backgroundColor:'#fff',padding:16,borderRadius:12},
  slotOption:{padding:10,borderBottomWidth:1,borderColor:'#f0f0f0'}
});
