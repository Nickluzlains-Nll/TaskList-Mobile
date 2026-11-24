import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Animated, Easing, Platform, StyleSheet } from 'react-native';
import Icone from './Icone';

function Spinner() {
  const giro = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(giro, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' })
    );
    anim.start();
    return () => anim.stop();
  }, [giro]);
  const rotate = giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View style={[s.spinner, { transform: [{ rotate }] }]} />;
}

/**
 * Telas "Entrando..." / "Login realizado com sucesso!" do site.
 * tipo: null (escondido) | 'carregando' | 'sucesso'
 */
export default function OverlayEstado({ tipo, titulo, subtitulo }) {
  return (
    <Modal visible={!!tipo} transparent animationType="fade" statusBarTranslucent>
      <View style={s.fundo}>
        {tipo === 'sucesso' ? (
          <View style={[s.caixa, { width: 300, padding: 35, borderRadius: 18 }]}>
            <View style={s.check}>
              <Icone nome="check" tamanho={32} />
            </View>
            <Text style={s.tituloOk}>{titulo}</Text>
            <Text style={s.subOk}>{subtitulo}</Text>
          </View>
        ) : (
          <View style={[s.caixa, { width: 220, padding: 30, borderRadius: 15 }]}>
            <Spinner />
            <Text style={s.txtLoad}>{titulo}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  caixa: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  spinner: {
    width: 45, height: 45, borderRadius: 23, borderWidth: 5,
    borderColor: '#dbe4f5', borderTopColor: '#1456d9', marginBottom: 15,
  },
  txtLoad: { color: '#102452', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  check: {
    width: 65, height: 65, borderRadius: 33, backgroundColor: '#22c55e',
    alignItems: 'center', justifyContent: 'center', marginBottom: 15,
  },
  tituloOk: { color: '#102452', fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subOk: { color: '#777777', fontSize: 14, textAlign: 'center' },
});
