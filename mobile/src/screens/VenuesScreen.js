import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Image, Text, TextInput, StyleSheet } from "react-native";

const API = process.env.API_URL || 'http://localhost:4000';

export default function VenuesScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchVenues(); }, [query, filter]);

  async function fetchVenues() {
    setLoading(true);
    try {
      const q = `?query=${encodeURIComponent(query)}${filter !== 'ALL' ? `&type=${filter}` : ''}`;
      const res = await fetch(`${API}/venues${q}`);
      const data = await res.json();
      setVenues(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function renderVenue({ item }) {
    return (
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/120' }} style={styles.img} />
        <View style={{ padding: 10, flex: 1 }}>
          <Text style={{ fontWeight: '700' }}>{item.name}</Text>
          <Text style={{ color: '#666' }}>{item.area}</Text>
          <Text style={{ marginTop: 6, color: item.isAvailable ? '#2ecc71' : '#e74c3c' }}>
            {item.isAvailable ? 'متاح الآن' : 'محجوز بالكامل'}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateMatch', { preselectedVenue: item })} style={styles.chooseBtn}>
            <Text style={{ color: '#27ae60' }}>اختر هذا الملعب</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex:1, backgroundColor: '#fff' }}>
      <TextInput placeholder="ابحث عن الملعب أو المنطقة" value={query} onChangeText={setQuery} style={styles.search} />
      <View style={styles.chips}>
        {['ALL','SEVEN','FIVE','NEAR','AVAILABLE'].map(ch => (
          <TouchableOpacity key={ch} onPress={() => setFilter(ch)} style={[styles.chip, filter===ch && styles.chipActive]}>
            <Text>{ch === 'ALL' ? 'الكل' : ch}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? <Text style={{padding:20}}>جاري التحميل...</Text> : (
        <FlatList data={venues} keyExtractor={v => v.id} renderItem={renderVenue} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  search: { margin:12, padding:12, borderRadius:8, backgroundColor:'#f6f6f6' },
  chips: { flexDirection:'row', paddingHorizontal:12, marginBottom:8 },
  chip: { paddingHorizontal:12, paddingVertical:8, backgroundColor:'#fff', marginRight:8, borderRadius:20, borderWidth:1, borderColor:'#eee' },
  chipActive: { backgroundColor:'#eafaf2', borderColor:'#cdeedd' },
  card: { flexDirection:'row', margin:12, backgroundColor:'#fff', borderRadius:10, shadowColor:'#000', elevation:2 },
  img: { width:120, height:90, borderTopLeftRadius:10, borderBottomLeftRadius:10 },
  chooseBtn: { marginTop:8, backgroundColor:'#eafaf2', padding:6, borderRadius:6, alignSelf:'flex-start' }
});
