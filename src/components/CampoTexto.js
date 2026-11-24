import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { cores } from '../theme/cores';

export default function CampoTexto({ rotulo, erro, senha, ...props }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={s.grupo}>
      {rotulo ? <Text style={s.rotulo}>{rotulo}</Text> : null}
      <View style={[s.caixa, erro ? s.caixaErro : null]}>
        <TextInput
          style={s.input}
          placeholderTextColor={cores.suave}
          autoCapitalize="none"
          secureTextEntry={senha && !visivel}
          {...props}
        />
        {senha ? (
          <TouchableOpacity onPress={() => setVisivel((v) => !v)} hitSlop={10}>
            <Text style={s.ver}>{visivel ? 'Ocultar' : 'Mostrar'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {erro ? <Text style={s.erro}>⚠ {erro}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  grupo: { marginBottom: 14 },
  rotulo: { color: cores.suave, fontSize: 13, marginBottom: 6 },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.painel,
    borderWidth: 1,
    borderColor: cores.linha,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  caixaErro: { borderColor: cores.erro },
  input: {
    flex: 1,
    color: cores.texto,
    fontSize: 16,
    paddingVertical: 14,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  ver: { color: cores.azul, fontSize: 13, fontWeight: '600', marginLeft: 8 },
  erro: { color: cores.erro, fontSize: 13, marginTop: 6 },
});
