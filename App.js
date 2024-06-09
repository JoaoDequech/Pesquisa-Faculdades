import 'react-native-gesture-handler';
import 'react-native-polyfill-globals/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaInicial from './pages/TelaInicial';
import Favoritos from './pages/Favoritos';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Pesquisa">
        <Stack.Screen name="Pesquisa" component={TelaInicial} />
        <Stack.Screen name="Favoritos" component={Favoritos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
