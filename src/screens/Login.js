import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import CampoIcone from '../components/CampoIcone';
import BotaoPrincipal from '../components/BotaoPrincipal';
import Checkbox from '../components/Checkbox';
import LoginSocial from '../components/LoginSocial';
import OverlayEstado from '../components/OverlayEstado';
import Icone from '../components/Icone';
import { Titulo, Destaque, Paragrafo } from '../components/painel';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services';
import { validarEmail, estadoEmail, errosDoLogin, mensagemErroAuth, loginCancelado, esperar } from '../utils/validacao';
import { lerEmailLembrado, lembrarEmail, esquecerEmail } from '../utils/emailLembrado';

function Beneficios() {
  return (
    <View style={s.beneficios}>
      {['Organização', 'Produtividade', 'Trabalho em equipe'].map((t) => (
        <View key={t} style={s.beneficio}>
          <View style={s.beneficioIcone}>
            <Icone nome="check" tamanho={11} />
          </View>
          <Text style={s.beneficioTxt}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

const AREA_TOQUE = { top: 14, bottom: 14, left: 10, right: 10 };

export default function Login({ navigation, route }) {
  const { pausar } = useAuth();
  const senhaRef = useRef(null);
  // Vem preenchido quando a pessoa acabou de criar a conta
  const emailDoCadastro = route && route.params ? route.params.email : undefined;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [emailSalvo, setEmailSalvo] = useState('');
  const [erros, setErros] = useState({});
  const [estado, setEstado] = useState(null); // null | 'carregando' | 'sucesso'
  const [googleAberto, setGoogleAberto] = useState(false);
  const [caps, setCaps] = useState(false);

  // E-mail lembrado (igual ao localStorage "email" do site)
  useEffect(() => {
    lerEmailLembrado().then((valor) => {
      if (valor && !emailDoCadastro) {
        setEmail(valor);
        setEmailSalvo(valor);
        setLembrar(true);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Depois do cadastro: e-mail já preenchido e cursor na senha
  useEffect(() => {
    if (!emailDoCadastro) return undefined;
    setEmail(emailDoCadastro);
    const t = setTimeout(() => senhaRef.current && senhaRef.current.focus(), 400);
    return () => clearTimeout(t);
  }, [emailDoCadastro]);

  // Mexer em qualquer campo também apaga "E-mail ou senha incorretos", que vale para os dois
  const limparErro = (campo) => setErros((atuais) => ({ ...atuais, [campo]: '', credenciais: '' }));

  async function trocarConta() {
    await esquecerEmail();
    setEmail('');
    setSenha('');
    setEmailSalvo('');
    setLembrar(false);
  }

  // Aviso de Caps Lock (só existe na versão web; no celular o teclado já mostra)
  function checarCaps(e) {
    if (Platform.OS !== 'web') return;
    const ev = e && e.nativeEvent;
    if (ev && typeof ev.getModifierState === 'function') setCaps(ev.getModifierState('CapsLock'));
  }

  async function enviar() {
    const novos = {};
    const erroEmail = validarEmail(email);
    const erroSenha = senha ? null : 'Digite sua senha.'; // regras de complexidade só no cadastro
    if (erroEmail) novos.email = erroEmail;
    if (erroSenha) novos.senha = erroSenha;
    setErros(novos);
    if (Object.keys(novos).length) return;

    setEstado('carregando');
    pausar(true); // segura na tela de login enquanto aparecem as mensagens
    try {
      if (lembrar) await lembrarEmail(email.trim());
      else await esquecerEmail();
      await Promise.all([authService.entrar({ email, senha, lembrar }), esperar(1500)]);
      await concluirLogin();
    } catch (e) {
      pausar(false);
      setEstado(null);
      setErros(errosDoLogin(e.code));
    }
  }

  async function entrarComGoogle() {
    setErros({});
    setGoogleAberto(true);
    pausar(true);
    try {
      await authService.entrarComGoogle({ lembrar });
      await concluirLogin();
    } catch (e) {
      pausar(false);
      if (!loginCancelado(e.code)) {
        setErros({ email: mensagemErroAuth(e.code, 'Não foi possível entrar com o Google. Tente novamente.') });
      }
    } finally {
      setGoogleAberto(false);
    }
  }

  // "Login realizado com sucesso!" por 1s e só então o App troca para a Home
  async function concluirLogin() {
    setEstado('sucesso');
    await esperar(1000);
    pausar(false);
  }

  const avisoCaps = caps ? (
    <View style={s.caps}>
      <Icone nome="triangle-exclamation" tamanho={13} cor="#f59e0b" />
      <Text style={s.capsTxt}>Caps Lock está ativado.</Text>
    </View>
  ) : null;

  return (
    <>
      <AuthLayout
        painel={(compacto) => (
          <>
            <Titulo compacto={compacto}>
              Bem-vindo <Destaque>de volta!</Destaque>
            </Titulo>
            {!compacto ? (
              <>
                <Paragrafo>Organize suas tarefas, aumente sua produtividade e trabalhe melhor em equipe.</Paragrafo>
                <Beneficios />
              </>
            ) : null}
          </>
        )}
      >
        {(compacto) => (
          <>
            {/* Saudação (no celular o e-mail aparece só no campo, sem repetir) */}
            <Text style={[s.h1, { fontSize: compacto ? 30 : 34, marginBottom: emailSalvo && !compacto ? 6 : compacto ? 20 : 25 }]}>
              {emailSalvo ? 'Olá Novamente! 💪' : 'Entrar na sua conta'}
            </Text>
            {emailSalvo && !compacto ? <Text style={s.emailSalvo}>{emailSalvo}</Text> : null}

            <CampoIcone
              icone="user"
              limpavel
              placeholder="Digite seu Email"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="username"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => senhaRef.current && senhaRef.current.focus()}
              value={email}
              onChangeText={(t) => { setEmail(t); limparErro('email'); }}
              estado={estadoEmail(email)}
              erro={erros.email || erros.credenciais}
            />

            {emailSalvo ? (
              <Pressable style={s.trocar} onPress={trocarConta} hitSlop={AREA_TOQUE}>
                <Icone nome="arrow-right-arrow-left" tamanho={12} cor={compacto ? '#6aa9ff' : '#1456d9'} />
                <Text style={[s.trocarTxt, { color: compacto ? '#6aa9ff' : '#1456d9' }]}>Trocar conta</Text>
              </Pressable>
            ) : null}

            <CampoIcone
              ref={senhaRef}
              senha
              placeholder="Digite uma senha"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              value={senha}
              onChangeText={(t) => { setSenha(t); limparErro('senha'); }}
              onKeyPress={checarCaps}
              onSubmitEditing={enviar}
              aviso={avisoCaps}
              erro={erros.senha || Boolean(erros.credenciais)}
            />

            <View style={s.lembrarLinha}>
              <Checkbox marcado={lembrar} onChange={setLembrar} style={{ minHeight: 40 }}>
                <Text style={s.lembrarTxt}>Lembrar meu e-mail</Text>
              </Checkbox>
              <Pressable onPress={() => navigation.navigate('Recuperar')} hitSlop={AREA_TOQUE}>
                <Text style={[s.lembrarTxt, { fontWeight: '500' }]}>Esqueci minha senha</Text>
              </Pressable>
            </View>

            <BotaoPrincipal titulo="Login" onPress={enviar} desabilitado={!!estado} />

            <View style={s.registro}>
              <Text style={s.registroTxt}>Não tenho uma conta </Text>
              <Pressable onPress={() => navigation.navigate('Cadastro')} hitSlop={AREA_TOQUE}>
                <Text style={s.registroLink}>Cadastre-se</Text>
              </Pressable>
            </View>

            {/* Escondido onde o Google não funciona, como o Expo Go (ver authPlataforma.js) */}
            {authService.googleDisponivel ? (
              <LoginSocial
                onGoogle={entrarComGoogle}
                onApple={() => setErros({ email: 'Login com Apple em breve.' })}
                desabilitado={!!estado || googleAberto}
              />
            ) : null}
          </>
        )}
      </AuthLayout>

      <OverlayEstado
        tipo={estado}
        titulo={estado === 'sucesso' ? 'Login realizado com sucesso!' : 'Entrando...'}
        subtitulo="Bem-vindo de volta."
      />
    </>
  );
}

const s = StyleSheet.create({
  h1: { fontWeight: '700', color: '#ffffff' },
  emailSalvo: { color: '#8fa4c1', fontSize: 14, fontWeight: '500', marginBottom: 20 },
  trocar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: -5, marginBottom: 10 },
  trocarTxt: { fontSize: 14, fontWeight: '600' },
  caps: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  capsTxt: { color: '#f59e0b', fontSize: 13, fontWeight: '500' },
  lembrarLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  lembrarTxt: { color: '#c4d2e7', fontSize: 14 },
  registro: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  registroTxt: { color: '#8fa4c1', fontSize: 14 },
  registroLink: { color: '#319cff', fontWeight: '700', fontSize: 14 },
  beneficios: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 20 },
  beneficio: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  beneficioIcone: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#1597ff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1597ff', shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 0 },
  },
  beneficioTxt: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
});
