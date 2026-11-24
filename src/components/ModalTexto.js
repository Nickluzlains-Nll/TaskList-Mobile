import React from 'react';
import { Modal, View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icone from './Icone';

// Modal branco de "Termos e Condições" / "Política de Privacidade"
export default function ModalTexto({ visivel, onFechar, icone, titulo, intro, secoes }) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar} statusBarTranslucent>
      <View style={s.fundo}>
        <View style={s.caixa}>
          <Pressable style={s.fechar} onPress={onFechar} hitSlop={8}>
            <Icone nome="xmark" tamanho={20} cor="#777777" />
          </Pressable>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={s.icone}>
              <Icone nome={icone} tamanho={27} cor="#1456d9" />
            </View>
            <Text style={s.titulo}>{titulo}</Text>
            <Text style={s.p}>{intro}</Text>
            {secoes.map((sec) => (
              <View key={sec.titulo}>
                <Text style={s.h3}>{sec.titulo}</Text>
                <Text style={s.p}>{sec.texto}</Text>
              </View>
            ))}
            <Pressable onPress={onFechar} style={{ marginTop: 20 }}>
              <LinearGradient colors={['#123b8f', '#1456d9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.botao}>
                <Text style={s.botaoTxt}>Entendi</Text>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  caixa: { width: 500, maxWidth: '100%', maxHeight: '85%', backgroundColor: '#ffffff', borderRadius: 20, padding: 35 },
  fechar: { position: 'absolute', top: 15, right: 18, width: 35, height: 35, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  icone: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#e8f0ff', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 15 },
  titulo: { textAlign: 'center', color: '#102452', fontSize: 24, fontWeight: '700', marginBottom: 20 },
  h3: { color: '#102452', fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 7 },
  p: { color: '#666666', fontSize: 14, lineHeight: 22, marginBottom: 10 },
  botao: { height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  botaoTxt: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
});
