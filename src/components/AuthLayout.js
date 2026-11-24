import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Animated, Easing, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Radial from './Radial';

// Bolinha que flutua (forma-3 do site)
function FormaFlutuante() {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const nativo = Platform.OS !== 'web';
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -14, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: nativo }),
        Animated.timing(y, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: nativo }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [y]);
  return (
    <Animated.View
      style={[s.forma, { width: 45, height: 45, left: 35, bottom: 100, backgroundColor: 'rgba(30,130,255,0.15)', borderWidth: 0, transform: [{ translateY: y }] }]}
    />
  );
}

/**
 * Cartão dividido em dois painéis.
 * - largura > 700 (computador/tablet): igual ao site, lado a lado.
 * - largura <= 700 (celular): tela cheia, com o painel azul reduzido a um cabeçalho pequeno,
 *   respeitando a barra de status e o teclado.
 *
 * `painel(compacto)` e `children` podem ser função: recebem `compacto` (true no celular).
 */
export default function AuthLayout({ painel, children }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const largo = width > 700;
  const compacto = !largo;

  return (
    <View style={{ flex: 1, backgroundColor: '#061a45' }}>
      <LinearGradient
        colors={['#061a45', '#0b3a8f', '#0a2f78']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={largo ? s.scrollLargo : { flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets
      >
        <View style={largo ? [s.sombra, { width: Math.min(1100, width - 40) }] : { width: '100%', flexGrow: 1 }}>
          <View style={largo ? [s.cartao, { flexDirection: 'row', minHeight: 700 }] : { flexGrow: 1 }}>
            {/* PAINEL AZUL */}
            <View
              style={[
                s.esq,
                largo
                  ? { width: '48%', padding: 50 }
                  : { width: '100%', paddingTop: insets.top + 22, paddingBottom: 24, paddingHorizontal: 24 },
              ]}
            >
              <LinearGradient
                colors={['#061536', '#0b2f78', '#124dc1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Radial id="radialEsq" cx="20%" cy="20%" r="45%" cor="#146eff" opacidade={0.35} />
              <View style={[s.forma, { width: 180, height: 180, top: -80, left: -80, borderColor: 'rgba(60,160,255,0.35)' }]} />
              <View style={[s.forma, { width: 240, height: 240, right: -130, bottom: -100, borderColor: 'rgba(60,160,255,0.25)' }]} />
              {largo ? <FormaFlutuante /> : null}
              <View style={s.conteudoEsq}>{painel(compacto)}</View>
            </View>

            {/* FORMULÁRIO */}
            <View
              style={[
                s.dir,
                largo
                  ? { width: '52%', paddingVertical: 45, paddingHorizontal: 65 }
                  : { width: '100%', flexGrow: 1, justifyContent: 'flex-start', paddingTop: 26, paddingHorizontal: 22, paddingBottom: insets.bottom + 28 },
              ]}
            >
              <LinearGradient
                colors={['#061226', '#071a35', '#0a2142']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Radial id="radialDir" cx="80%" cy="10%" r="45%" cor="#1456d9" opacidade={0.12} />
              <View style={{ width: '100%' }}>{typeof children === 'function' ? children(compacto) : children}</View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  scrollLargo: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 },
  sombra: {
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.45,
    shadowRadius: 35,
    elevation: 20,
  },
  cartao: { borderRadius: 25, overflow: 'hidden', backgroundColor: '#061226' },
  esq: { overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  conteudoEsq: { width: '100%', maxWidth: 450, alignItems: 'center' },
  dir: { justifyContent: 'center', overflow: 'hidden' },
  forma: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(30,130,255,0.12)',
    borderWidth: 1,
  },
});
