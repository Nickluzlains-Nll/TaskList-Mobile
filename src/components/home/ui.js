import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, Platform, StyleSheet } from 'react-native';

export function Rotulo({ children, opcional }) {
  return (
    <Text style={s.rotulo}>
      {children}
      {opcional ? <Text style={s.opcional}> opcional</Text> : null}
    </Text>
  );
}

// .text-field do site
export function Entrada({ multiline, style, ...props }) {
  const [foco, setFoco] = useState(false);
  return (
    <TextInput
      style={[s.entrada, multiline ? s.area : null, foco ? s.foco : null, style]}
      placeholderTextColor="#747b87"
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      onFocus={() => setFoco(true)}
      onBlur={() => setFoco(false)}
      {...props}
    />
  );
}

// Equivalente ao <select>: abre a lista logo abaixo do campo
export function Selecao({ valor, opcoes, onChange }) {
  const [aberto, setAberto] = useState(false);
  const atual = opcoes.find((o) => o.valor === valor) || opcoes[0];
  return (
    <View>
      <Pressable style={[s.entrada, s.selecao, aberto ? s.foco : null]} onPress={() => setAberto((a) => !a)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          {atual.cor ? <View style={[s.ponto, { backgroundColor: atual.cor }]} /> : null}
          <Text style={s.selecaoTxt} numberOfLines={1}>{atual.rotulo}</Text>
        </View>
        <Text style={{ color: '#9ca3af', fontSize: 10 }}>{aberto ? '▲' : '▼'}</Text>
      </Pressable>
      {aberto ? (
        <View style={s.lista}>
          {opcoes.map((o) => (
            <Pressable
              key={o.valor}
              style={({ hovered }) => [s.opcao, o.valor === valor ? s.opcaoAtiva : null, hovered ? { backgroundColor: '#1d212b' } : null]}
              onPress={() => { onChange(o.valor); setAberto(false); }}
            >
              {o.cor ? <View style={[s.ponto, { backgroundColor: o.cor }]} /> : null}
              <Text style={s.selecaoTxt} numberOfLines={1}>{o.rotulo}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const CORES_BOTAO = {
  primario: { bg: '#3b82f6', bgHover: '#5b98ff', borda: 'transparent', bordaHover: 'transparent', txt: '#ffffff' },
  secundario: { bg: '#222630', bgHover: '#2b303b', borda: '#2b2f3a', bordaHover: '#4b5563', txt: '#e5e7eb' },
  perigo: { bg: '#b91c1c', bgHover: '#dc2626', borda: 'transparent', bordaHover: 'transparent', txt: '#ffffff' },
};

export function Botao({ tipo = 'primario', titulo, onPress, desabilitado, style, children }) {
  const c = CORES_BOTAO[tipo];
  return (
    <Pressable onPress={onPress} disabled={desabilitado}>
      {({ hovered, pressed }) => (
        <View
          style={[
            s.botao,
            { backgroundColor: hovered ? c.bgHover : c.bg, borderColor: hovered ? c.bordaHover : c.borda },
            tipo === 'primario' && hovered ? { transform: [{ translateY: -1 }] } : null,
            pressed ? { opacity: 0.85 } : null,
            desabilitado ? { opacity: 0.55 } : null,
            style,
          ]}
        >
          {children || <Text style={[s.botaoTxt, { color: c.txt }]}>{titulo}</Text>}
        </View>
      )}
    </Pressable>
  );
}

export function BotaoTexto({ titulo, onPress, cor = '#93c5fd', style }) {
  return (
    <Pressable onPress={onPress} style={style}>
      {({ hovered }) => (
        <Text style={{ color: hovered ? '#bfdbfe' : cor, fontSize: 12, paddingVertical: 5, textDecorationLine: hovered ? 'underline' : 'none' }}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

export function Avatar({ nome, foto, tamanho = 44, fonte = 19 }) {
  const inicial = ((nome || '').trim()[0] || 'M').toUpperCase();
  return (
    <View style={{ width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {foto ? (
        <Image source={{ uri: foto }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <Text style={{ color: '#ffffff', fontSize: fonte, fontWeight: '700' }}>{inicial}</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  rotulo: { marginTop: 6, color: '#e5e7eb', fontSize: 12, fontWeight: '600' },
  opcional: { color: '#9ca3af', fontWeight: '400' },
  entrada: {
    width: '100%', minHeight: 40, paddingHorizontal: 11, paddingVertical: 9, borderWidth: 1, borderColor: '#353b47',
    borderRadius: 7, backgroundColor: '#12151c', color: '#ffffff', fontSize: 13,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  area: { minHeight: 78 },
  foco: {
    borderColor: '#4c83d5', shadowColor: '#3b82f6', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 0 },
  },
  selecao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selecaoTxt: { color: '#ffffff', fontSize: 13, flexShrink: 1 },
  lista: { marginTop: 4, borderWidth: 1, borderColor: '#353b47', borderRadius: 7, backgroundColor: '#12151c', overflow: 'hidden' },
  opcao: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 11, paddingVertical: 10 },
  opcaoAtiva: { backgroundColor: 'rgba(59,130,246,0.14)' },
  ponto: { width: 8, height: 8, borderRadius: 4 },
  botao: {
    minHeight: 38, paddingHorizontal: 14, borderWidth: 1, borderRadius: 7, alignItems: 'center', justifyContent: 'center',
  },
  botaoTxt: { fontSize: 13, fontWeight: '600' },
});
