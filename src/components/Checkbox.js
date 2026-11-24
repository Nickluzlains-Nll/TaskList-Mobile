import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Icone from './Icone';

// rotuloClicavel=false: só a caixinha marca/desmarca (útil quando o texto tem links)
export default function Checkbox({ marcado, onChange, tamanho = 15, children, style, caixaStyle, rotuloClicavel = true }) {
  const caixa = (
    <View
      style={[
        { width: tamanho, height: tamanho, borderRadius: 3, borderWidth: 1, borderColor: '#767676', backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
        marcado ? { backgroundColor: '#1597ff', borderColor: '#1597ff' } : null,
        caixaStyle,
      ]}
    >
      {marcado ? <Icone nome="check" tamanho={tamanho - 6} /> : null}
    </View>
  );

  if (rotuloClicavel) {
    return (
      <Pressable onPress={() => onChange(!marcado)} style={[s.linha, style]}>
        {caixa}
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[s.linha, style]}>
      <Pressable onPress={() => onChange(!marcado)} hitSlop={12}>{caixa}</Pressable>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({ linha: { flexDirection: 'row', alignItems: 'center', gap: 6 } });
