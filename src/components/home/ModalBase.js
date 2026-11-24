import React from 'react';
import { Modal, View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions } from 'react-native';

// .modal / .modal-card do site
export default function ModalBase({ visivel, onFechar, eyebrow, titulo, children }) {
  const { width } = useWindowDimensions();
  const estreito = width <= 450;
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.fundo}>
        <View style={[s.card, { width: Math.min(520, width - 28) }]}>
          <ScrollView style={{ flexGrow: 0 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: estreito ? 19 : 24, gap: 9 }}>
            <View style={s.cabecalho}>
              <View style={{ flex: 1 }}>
                <Text style={s.eyebrow}>{eyebrow}</Text>
                <Text style={s.titulo}>{titulo}</Text>
              </View>
              <Pressable onPress={onFechar} hitSlop={8}>
                {({ hovered }) => (
                  <View style={[s.fechar, hovered ? { backgroundColor: '#303541' } : null]}>
                    <Text style={{ color: hovered ? '#ffffff' : '#9ca3af', fontSize: 24, lineHeight: 26 }}>×</Text>
                  </View>
                )}
              </Pressable>
            </View>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// Rodapé com os botões (empilhados e invertidos no celular, como no CSS)
export function AcoesModal({ children, empilhado }) {
  const { width } = useWindowDimensions();
  const estreito = width <= 450 && !empilhado;
  return (
    <View
      style={[
        s.acoes,
        empilhado ? { flexDirection: 'column', alignItems: 'stretch' } : null,
        estreito ? { flexDirection: 'column-reverse', alignItems: 'stretch' } : null,
      ]}
    >
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(3,6,13,0.74)', alignItems: 'center', justifyContent: 'center', padding: 14 },
  card: {
    maxHeight: '90%', backgroundColor: '#1a1d26', borderWidth: 1, borderColor: '#343a46', borderRadius: 13, overflow: 'hidden',
  },
  cabecalho: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 15, marginBottom: 9 },
  eyebrow: { color: '#8ba5d3', fontSize: 11, fontWeight: '700', letterSpacing: 1.3, marginBottom: 6 },
  titulo: { color: '#ffffff', fontSize: 21, fontWeight: '700', letterSpacing: -0.4 },
  fechar: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  acoes: {
    flexDirection: 'row', justifyContent: 'flex-end', gap: 9, marginTop: 12, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#2b2f3a',
  },
});
