import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AuthLayout from '../components/AuthLayout';
import CampoIcone from '../components/CampoIcone';
import BotaoPrincipal from '../components/BotaoPrincipal';
import OverlayEstado from '../components/OverlayEstado';
import { Titulo, Destaque, Paragrafo, IconeBoasVindas } from '../components/painel';
import { authService } from '../services';
import { validarEmail, mensagemErroAuth, esperar } from '../utils/validacao';
import { lerEmailLembrado } from '../utils/emailLembrado';

const VOLTAR_PARA_LOGIN_EM = 4000;

const PASSOS = [
  { titulo: 'Digite seu e-mail', texto: 'Use o mesmo e-mail do seu cadastro.' },
  { titulo: 'Confira sua caixa de entrada', texto: 'Se não encontrar, olhe também o spam.' },
  { titulo: 'Crie uma nova senha', texto: 'Depois é só voltar e entrar na sua conta.' },
];

const AREA_TOQUE = { top: 14, bottom: 14, left: 10, right: 10 };

export default function Recuperar({ navigation }) {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [estado, setEstado] = useState(null);

  // Preenche com o e-mail lembrado no login, se houver (igual ao site)
  useEffect(() => {
    lerEmailLembrado().then((valor) => {
      if (valor) setEmail((atual) => atual || valor);
    });
  }, []);

  // Depois de enviar, volta sozinho para o login. Se a pessoa mexer no campo, cancela.
  useEffect(() => {
    if (!enviado) return undefined;
    const t = setTimeout(() => navigation.navigate('Login'), VOLTAR_PARA_LOGIN_EM);
    return () => clearTimeout(t);
  }, [enviado, navigation]);

  async function enviar() {
    const e = validarEmail(email);
    setErro(e || '');
    setEnviado(false);
    if (e) return;
    setEstado('carregando');
    try {
      await Promise.all([authService.recuperarSenha(email.trim()), esperar(1000)]);
      setEnviado(true);
    } catch (err) {
      setErro(mensagemErroAuth(err.code));
    } finally {
      setEstado(null);
    }
  }

  return (
    <>
      <AuthLayout
        painel={(compacto) =>
          compacto ? (
            // Celular: só o título (o formulário já explica o que fazer)
            <Titulo compacto>
              Esqueceu a senha? <Destaque>Sem problema.</Destaque>
            </Titulo>
          ) : (
            <>
              <IconeBoasVindas nome="key" />
              <Titulo>
                Esqueceu a senha? <Destaque>Sem problema.</Destaque>
              </Titulo>
              <Paragrafo>Informe o e-mail da sua conta e enviaremos as instruções para você voltar a acessar.</Paragrafo>
              <View style={s.passos}>
                {PASSOS.map((p, i) => (
                  <View key={p.titulo} style={[s.passo, i < PASSOS.length - 1 ? { paddingBottom: 24 } : null]}>
                    {i < PASSOS.length - 1 ? (
                      <LinearGradient colors={['rgba(32,164,255,0.6)', 'rgba(32,164,255,0.1)']} style={s.conector} />
                    ) : null}
                    <View style={s.numero}>
                      <Text style={s.numeroTxt}>{i + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.passoTitulo}>{p.titulo}</Text>
                      <Text style={s.passoTexto}>{p.texto}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )
        }
      >
        {(compacto) => (
          <>
            {/* No celular o título já está no cabeçalho azul */}
            {!compacto ? <Text style={s.h1}>Esqueci minha senha</Text> : null}
            <Text style={[s.sub, compacto ? { marginBottom: 22 } : null]}>Digite seu e-mail cadastrado na sua conta.</Text>

            <CampoIcone
              icone="envelope"
              placeholder="Digite seu Email"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="send"
              value={email}
              onChangeText={(t) => { setEmail(t); setErro(''); setEnviado(false); }}
              onSubmitEditing={enviar}
              erro={erro}
            />

            {enviado ? (
              <Text style={s.ok}>
                Se esse e-mail estiver cadastrado, enviamos as instruções. Confira também o spam.
              </Text>
            ) : null}

            <BotaoPrincipal titulo="Recuperar senha" onPress={enviar} desabilitado={!!estado} />

            <View style={s.registro}>
              <Text style={s.registroTxt}>Já lembrou sua senha? </Text>
              <Pressable onPress={() => navigation.navigate('Login')} hitSlop={AREA_TOQUE}>
                <Text style={s.registroLink}>Faça login</Text>
              </Pressable>
            </View>
          </>
        )}
      </AuthLayout>

      <OverlayEstado tipo={estado} titulo="Enviando..." subtitulo="" />
    </>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  sub: { color: '#8fa4c1', fontSize: 14, lineHeight: 21, marginBottom: 30 },
  ok: { color: '#22c55e', fontSize: 13, lineHeight: 19, marginBottom: 18 },
  registro: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  registroTxt: { color: '#8fa4c1', fontSize: 14 },
  registroLink: { color: '#319cff', fontWeight: '700', fontSize: 14 },
  passos: { width: '100%', maxWidth: 340 },
  passo: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  conector: { position: 'absolute', left: 14, top: 34, bottom: 4, width: 2 },
  numero: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#20a4ff',
    backgroundColor: 'rgba(32,164,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  numeroTxt: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  passoTitulo: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginBottom: 3 },
  passoTexto: { color: '#c4d8f5', fontSize: 13, lineHeight: 19 },
});
