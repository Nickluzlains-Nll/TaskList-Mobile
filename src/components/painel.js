import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icone from './Icone';

// Peças do painel azul (h2, p, ícone grande) — iguais ao .welcome do site
export function Destaque({ children }) {
  return <Text style={{ color: '#20a4ff' }}>{children}</Text>;
}

// compacto (celular): título menor e sem margem, para o cabeçalho ocupar pouco espaço
export function Titulo({ children, compacto }) {
  return <Text style={[s.titulo, compacto ? s.tituloCompacto : null]}>{children}</Text>;
}

export function Paragrafo({ children, compacto }) {
  return <Text style={[s.paragrafo, compacto ? { marginBottom: 0 } : null]}>{children}</Text>;
}

export function IconeBoasVindas({ nome, compacto }) {
  const t = compacto ? 52 : 64;
  return (
    <View style={[s.icone, { width: t, height: t, marginBottom: compacto ? 16 : 24 }]}>
      <Icone nome={nome} tamanho={compacto ? 22 : 26} />
    </View>
  );
}

const s = StyleSheet.create({
  titulo: { fontSize: 36, lineHeight: 41, fontWeight: '700', color: '#ffffff', textAlign: 'center', marginBottom: 28 },
  tituloCompacto: { fontSize: 26, lineHeight: 32, marginBottom: 0 },
  paragrafo: { fontSize: 16, lineHeight: 26, color: '#ffffff', textAlign: 'center', maxWidth: 350, marginBottom: 30 },
  icone: {
    alignSelf: 'center',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(21,151,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(96,180,255,0.35)',
    shadowColor: '#1597ff',
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },
});
