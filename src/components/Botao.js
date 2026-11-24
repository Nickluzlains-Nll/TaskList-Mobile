import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { cores } from '../theme/cores';

export default function Botao({ titulo, onPress, carregando, secundario, style }) {
  return (
    <TouchableOpacity
      style={[s.botao, secundario ? s.secundario : s.primario, style]}
      onPress={onPress}
      disabled={carregando}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color={cores.texto} />
      ) : (
        <Text style={[s.texto, secundario ? { color: cores.suave } : null]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  botao: { borderRadius: 12, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  primario: { backgroundColor: cores.azul },
  secundario: { backgroundColor: 'transparent', borderWidth: 1, borderColor: cores.linha },
  texto: { color: cores.texto, fontSize: 16, fontWeight: '700' },
});
