import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Botão azul em degradê (.button-login do site)
export default function BotaoPrincipal({ titulo, onPress, desabilitado }) {
  return (
    <Pressable onPress={onPress} disabled={desabilitado}>
      {({ pressed, hovered }) => (
        <View style={[s.sombra, { transform: [{ translateY: hovered ? -2 : 0 }], opacity: pressed ? 0.9 : 1 }]}>
          <LinearGradient colors={['#087cff', '#1760db']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.grad}>
            <Text style={s.texto}>{titulo}</Text>
          </LinearGradient>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  sombra: {
    borderRadius: 11,
    shadowColor: '#1464e6',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  grad: { height: 52, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  texto: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});
