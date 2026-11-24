import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated, Easing, PanResponder, Platform, StyleSheet } from 'react-native';

/**
 * Gaveta lateral (menu escondido). Desliza da esquerda, escurece o fundo,
 * fecha tocando fora ou arrastando para a esquerda.
 */
export default function Gaveta({ aberta, onFechar, largura, topo = 0, base = 0, children }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [montada, setMontada] = useState(aberta);
  const fecharRef = useRef(onFechar);
  fecharRef.current = onFechar;

  useEffect(() => {
    if (aberta) setMontada(true);
    Animated.timing(anim, {
      toValue: aberta ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (finished && !aberta) setMontada(false);
    });
  }, [aberta, anim]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dx < -12 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50) fecharRef.current();
      },
    })
  ).current;

  if (!montada) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={aberta ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(3,6,13,0.7)', opacity: anim }]}>
        <Pressable style={{ flex: 1 }} onPress={onFechar} />
      </Animated.View>
      <Animated.View
        {...pan.panHandlers}
        style={[
          s.painel,
          { width: largura, paddingTop: topo, paddingBottom: base, transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-largura, 0] }) }] },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

// Faixa fina na borda esquerda: arrastar para a direita abre a gaveta
export function BordaGaveta({ onAbrir }) {
  const abrirRef = useRef(onAbrir);
  abrirRef.current = onAbrir;
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dx > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dx > 40) abrirRef.current();
      },
    })
  ).current;
  return <View {...pan.panHandlers} style={s.borda} />;
}

const s = StyleSheet.create({
  painel: {
    position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#161922',
    borderRightWidth: 1, borderRightColor: '#252832',
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 25, shadowOffset: { width: 8, height: 0 }, elevation: 24,
  },
  borda: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 14 },
});
