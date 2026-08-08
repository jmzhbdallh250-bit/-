import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CreateMatchScreen({ navigation, route }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('SEVEN'); // default
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString());

  function goToFormation() {
    const draft = { title: title || `مباراة ${type}`, type, scheduledAt };
    navigation.navigate('FormationBuilder', { draft });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h}>انشاء ماتش سريع</Text>

      <Text style={styles.label}>عنوان المباراة</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="اسم المباراة" style={styles.input} />

      <Text style={styles.label}>نوع الماتش</Text>
      <View style={styles.row}>
        {['FIVE','SEVEN','ELEVEN'].map(t => (
          <TouchableOpacity key={t} onPress={() => setType(t)} style={[styles.typeBtn, type===t && styles.typeBtnActive]}>
            <Text style={type===t ? styles.typeTextActive : styles.typeText}>{t === 'FIVE' ? 'خماسي' : t === 'SEVEN' ? 'سباعي' : '11'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>الوقت (تجريبي)</Text>
      <TextInput value={scheduledAt} onChangeText={setScheduledAt} style={styles.input} />

      <TouchableOpacity style={styles.continue} onPress={goToFormation}>
        <Text style={{ color: '#fff', fontWeight:'700' }}>انتقل لصانع التشكيلة</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff',padding:16},
  h:{fontSize:20,fontWeight:'800',marginBottom:12},
  label:{marginTop:12,marginBottom:6,fontWeight:'600'},
  input:{padding:12,borderRadius:8,backgroundColor:'#f6f6f6'},
  row:{flexDirection:'row',justifyContent:'space-between'},
  typeBtn:{padding:12, borderRadius:8, backgroundColor:'#fff', borderWidth:1, borderColor:'#eee', minWidth:80, alignItems:'center'},
  typeBtnActive:{backgroundColor:'#eafaf2', borderColor:'#cdeedd'},
  typeText:{color:'#333'},
  typeTextActive:{color:'#27ae60', fontWeight:'700'},
  continue:{marginTop:24,backgroundColor:'#00E676',padding:14,borderRadius:10,alignItems:'center'}
});
