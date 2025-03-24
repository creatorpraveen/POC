import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BGRemoveScreen from './src/screens/BGRemoveScreen';
import HomeScreen from './src/screens/HomeScreen';
import GridScreen from './src/screens/GridScreen';
import ResizeScreen from './src/screens/ResizeScreen';
import Testing from './src/screens/Testing';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Remover" component={BGRemoveScreen} />
        <Stack.Screen name="Post" component={GridScreen} />
        <Stack.Screen name="Testing" component={ResizeScreen} />
        <Stack.Screen name="Testing2" component={Testing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
