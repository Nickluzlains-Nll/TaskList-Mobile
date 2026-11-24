import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Icone from './Icone';

// "ou" + botões Google / Apple. A tela decide o que cada botão faz.
export default function LoginSocial({ onGoogle, onApple, desabilitado }) {
  const { width } = useWindowDimensions();
  const coluna = width <= 500;

  return (
    <View style={{ marginTop: 18 }}>
      <View style={s.divisor}>
        <View style={s.linha} />
        <Text style={s.ou}>ou</Text>
        <View style={s.linha} />
      </View>
      <View style={[s.botoes, coluna ? { flexDirection: 'column' } : null]}>
        <Pressable
          onPress={onGoogle}
          disabled={desabilitado}
          accessibilityRole="button"
          accessibilityLabel="Entrar com Google"
          style={({ hovered }) => [s.botao, hovered ? { borderColor: '#4285f4', backgroundColor: '#f8fbff' } : null, desabilitado ? s.desabilitado : null]}
        >
          <Icone nome="google" marca tamanho={18} cor="#4285f4" />
          <Text style={s.texto}>Google</Text>
        </Pressable>
        <Pressable
          onPress={onApple}
          disabled={desabilitado}
          accessibilityRole="button"
          accessibilityLabel="Entrar com Apple"
          style={({ hovered }) => [s.botao, hovered ? { backgroundColor: '#111827', borderColor: '#111827' } : null, desabilitado ? s.desabilitado : null]}
        >
          {({ hovered }) => (
            <>
              <Icone nome="apple" marca tamanho={18} cor={hovered ? '#ffffff' : '#111111'} />
              <Text style={[s.texto, hovered ? { color: '#ffffff' } : null]}>Apple</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  divisor: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  linha: { flex: 1, height: 1, backgroundColor: '#d9dee8' },
  ou: { color: '#888888', fontSize: 14 },
  botoes: { flexDirection: 'row', gap: 12 },
  botao: {
    flex: 1, height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    borderWidth: 1, borderColor: '#d5dbe5', borderRadius: 10, backgroundColor: '#ffffff',
  },
  texto: { color: '#333333', fontSize: 14, fontWeight: '700' },
  desabilitado: { opacity: 0.6 },
});
