import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { cores } from './src/theme/cores';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import Recuperar from './src/screens/Recuperar';
import Home from './src/screens/Home';

const Stack = createNativeStackNavigator();

const tema = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: cores.fundo, card: cores.fundo, primary: cores.azul },
};

function Rotas() {
  const { usuario, carregando, pausado } = useAuth();
  const logado = usuario && !pausado;

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: cores.fundo, justifyContent: 'center' }}>
        <ActivityIndicator color={cores.azul} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {logado ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Recuperar" component={Recuperar} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer theme={tema}>
        <StatusBar style="light" />
        <Rotas />
      </NavigationContainer>
    </AuthProvider>
  );
}
