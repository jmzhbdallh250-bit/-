import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VenuesScreen from './src/screens/VenuesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MercatoScreen from './src/screens/MercatoScreen';
import CreateMatchScreen from './src/screens/CreateMatchScreen';
import FormationBuilder from './src/screens/FormationBuilder';
import MatchDetail from './src/screens/MatchDetail';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown:false, tabBarStyle:{height:70,paddingBottom:10} }}>
      <Tab.Screen name="Venues" component={VenuesScreen} options={{ tabBarLabel: 'الملاعب' }} />
      <Tab.Screen name="Mercato" component={MercatoScreen} options={{ tabBarLabel: 'الميركاتو' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'بروفايلي' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown:false }}>
        <Stack.Screen name="RootTabs" component={Tabs} />
        <Stack.Screen name="CreateMatch" component={CreateMatchScreen} />
        <Stack.Screen name="FormationBuilder" component={FormationBuilder} />
        <Stack.Screen name="MatchDetail" component={MatchDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#00E676',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#00E676',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6
  }
});
