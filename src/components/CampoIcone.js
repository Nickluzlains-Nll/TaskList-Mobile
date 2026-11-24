import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, Animated, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import Icone from './Icone';

/**
 * Campo igual ao .input-mail / .input-password do site:
 * 52px de altura, ícone à direita, borda azul, sobe 2px ao focar,
 * "treme" quando dá erro, e reserva espaço fixo para a mensagem.
 * `erro` = texto (destaca e mostra a mensagem) ou `true` (só destaca: a mensagem está em outro campo).
 * No celular o espaço vazio da esquerda some (mais largura útil) e as áreas de toque ficam maiores.
 * `ref` aponta para o TextInput (para pular de campo com o botão "próximo" do teclado).
 * `dica` = { texto, cor } mostra uma mensagem informativa (ex.: "senhas coincidem") quando não há erro.
 * `estado` = 'valido' | 'invalido' pinta e aumenta o ícone enquanto a pessoa digita (#iconeEmail do site).
 */
const ESTILO_ESTADO = {
  valido: { cor: '#22c55e', escala: 1.15 },
  invalido: { cor: '#ef4444', escala: 1.1 },
};

// Erro ganha da dica; `erro === true` destaca o campo sem texto (e esconde a dica)
function textoDaMensagem(erro, dica) {
  if (typeof erro === 'string' && erro) return { texto: `⚠ ${erro}`, cor: '#d93025' };
  if (!erro && dica) return dica;
  return null;
}

const CampoIcone = forwardRef(function CampoIcone(
  { icone, senha, limpavel, erro, aviso, dica, estado, value, onChangeText, ...props },
  ref
) {
  const { width } = useWindowDimensions();
  const compacto = width <= 700;
  const [foco, setFoco] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const tremor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!erro) return;
    const nativo = Platform.OS !== 'web';
    Animated.sequence(
      [-6, 6, -4, 4, 0].map((v) => Animated.timing(tremor, { toValue: v, duration: 50, useNativeDriver: nativo }))
    ).start();
  }, [erro, tremor]);

  const estiloEstado = ESTILO_ESTADO[estado];
  const escalaIcone = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(escalaIcone, {
      toValue: estiloEstado ? estiloEstado.escala : 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [estiloEstado, escalaIcone]);

  const corIcone = estiloEstado ? estiloEstado.cor : foco ? '#20a4ff' : '#526789';

  const mensagem = textoDaMensagem(erro, dica);
  const temLimpar = !!limpavel && !!value;
  const paddingEsq = compacto ? 16 : 55;
  const paddingDir = compacto ? (temLimpar ? 86 : 54) : 55;

  return (
    <View>
      <Animated.View
        style={[
          s.caixa,
          foco ? s.caixaFoco : null,
          erro ? s.caixaErro : null,
          { transform: [{ translateY: foco ? -2 : 0 }, { translateX: tremor }] },
        ]}
      >
        <TextInput
          ref={ref}
          style={[s.input, { paddingLeft: paddingEsq, paddingRight: paddingDir }]}
          placeholderTextColor="#9db1d0"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={senha && !visivel}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFoco(true)}
          onBlur={() => setFoco(false)}
          {...props}
        />
        {temLimpar ? (
          <Pressable style={s.limpar} onPress={() => onChangeText('')}>
            <Icone nome="xmark" tamanho={15} cor="#8a94a6" />
          </Pressable>
        ) : null}
        <Pressable style={s.icone} disabled={!senha} onPress={() => setVisivel((v) => !v)}>
          <Animated.View style={{ transform: [{ scale: escalaIcone }] }}>
            <Icone nome={senha ? (visivel ? 'eye-slash' : 'eye') : icone} tamanho={18} cor={corIcone} />
          </Animated.View>
        </Pressable>
      </Animated.View>

      {aviso ? <View style={{ marginTop: 7, marginBottom: 4 }}>{aviso}</View> : null}
      {/* espaço sempre reservado: o formulário não "pula" quando a mensagem aparece */}
      <Text style={[s.mensagem, mensagem ? { color: mensagem.cor } : null, aviso ? { marginTop: 0 } : null]}>
        {mensagem ? mensagem.texto : ' '}
      </Text>
    </View>
  );
});

export default CampoIcone;

const s = StyleSheet.create({
  caixa: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(70,150,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
  },
  caixaFoco: {
    borderColor: '#168cff',
    backgroundColor: 'rgba(20,100,220,0.12)',
    shadowColor: '#148cff',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  caixaErro: {
    borderColor: '#d93025',
    shadowColor: '#d93025',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  // áreas de toque grandes (a altura toda do campo), com o ícone no mesmo lugar de antes
  icone: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 58, alignItems: 'center', justifyContent: 'center' },
  limpar: { position: 'absolute', right: 42, top: 0, bottom: 0, width: 44, alignItems: 'center', justifyContent: 'center' },
  mensagem: { fontSize: 13, marginTop: 3, marginBottom: 15, minHeight: 16 },
});
