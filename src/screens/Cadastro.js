import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import CampoIcone from '../components/CampoIcone';
import BotaoPrincipal from '../components/BotaoPrincipal';
import Checkbox from '../components/Checkbox';
import OverlayEstado from '../components/OverlayEstado';
import ModalTexto from '../components/ModalTexto';
import Icone from '../components/Icone';
import { Titulo, Destaque, Paragrafo, IconeBoasVindas } from '../components/painel';
import { authService } from '../services';
import { validarEmail, validarSenha, regrasSenha, forcaSenha, mensagemErroAuth, esperar } from '../utils/validacao';

const BENEFICIOS = [
  { icone: 'list-check', titulo: 'Tarefas em um só lugar', texto: 'Crie, ordene e conclua sem perder nada de vista.' },
  { icone: 'chart-line', titulo: 'Acompanhe seu progresso', texto: 'Veja o que já foi feito e o que ainda falta.' },
  { icone: 'users', titulo: 'Trabalhe em equipe', texto: 'Divida tarefas e mantenha todo mundo alinhado.' },
];

const AREA_TOQUE = { top: 14, bottom: 14, left: 10, right: 10 };

// Como no site: com nome e sobrenome, o ícone vira "pessoas"
const iconeDoNome = (nome) => (nome.trim().includes(' ') ? 'users' : 'user');
// Dica para o gerenciador de senhas do iPhone sugerir uma senha que atende às nossas regras
const REGRAS_IOS = 'minlength: 8; required: lower; required: upper; required: digit; required: [!@#$%^&*]';

export default function Cadastro({ navigation }) {
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  const confirmarRef = useRef(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [termos, setTermos] = useState(false);
  const [erros, setErros] = useState({});
  const [estado, setEstado] = useState(null); // null | 'carregando' | 'sucesso'
  const [modal, setModal] = useState(null); // null | 'termos' | 'privacidade'

  const limpar = (campo) => setErros((e) => ({ ...e, [campo]: '' }));

  async function enviar() {
    const n = {};
    if (nome.trim().length < 2) n.nome = 'Digite seu nome.';
    const erroEmail = validarEmail(email);
    if (erroEmail) n.email = erroEmail;
    const erroSenha = validarSenha(senha);
    if (erroSenha) n.senha = erroSenha;
    if (!confirmar) n.confirmar = 'Confirme sua senha.';
    else if (confirmar !== senha) n.confirmar = 'As senhas não coincidem.';
    if (!termos) n.termos = 'Você precisa aceitar os Termos e Condições.';
    setErros(n);
    if (Object.keys(n).length) return;

    setEstado('carregando');
    try {
      await Promise.all([authService.registrar({ nome, email, senha }), esperar(1500)]);
      setEstado('sucesso');
      await esperar(1500);
      setEstado(null);
      // Como no site, vai para o login — agora com o e-mail já preenchido
      navigation.navigate('Login', { email: email.trim().toLowerCase() });
    } catch (e) {
      setEstado(null);
      setErros({ email: mensagemErroAuth(e.code) });
    }
  }

  // Mostra enquanto digita se as senhas batem (só avisa "não coincidem" quando já não dá para ser o começo da senha)
  let dicaConfirmar = null;
  if (confirmar.length > 0) {
    if (confirmar === senha) dicaConfirmar = { texto: '✓ As senhas coincidem', cor: '#22c55e' };
    else if (!senha.startsWith(confirmar)) dicaConfirmar = { texto: 'As senhas ainda não coincidem', cor: '#f59e0b' };
  }

  const forca = forcaSenha(senha);
  const barraForca =
    senha.length > 0 ? (
      <View style={{ marginTop: 4 }}>
        <View style={s.forcaTopo}>
          <Text style={s.forcaRotulo}>Força da Senha</Text>
          <Text style={[s.forcaRotulo, { color: forca.cor }]}>{forca.texto}</Text>
        </View>
        <View style={s.barra}>
          <View style={{ width: `${forca.largura}%`, height: '100%', borderRadius: 10, backgroundColor: forca.cor }} />
        </View>
      </View>
    ) : null;

  return (
    <>
      <AuthLayout
        painel={(compacto) =>
          compacto ? (
            // Celular: só o título (o resto fica no formulário, sem repetir)
            <Titulo compacto>
              Crie sua conta <Destaque>e comece agora</Destaque>
            </Titulo>
          ) : (
            <>
              <IconeBoasVindas nome="user-plus" />
              <Titulo>
                Crie sua conta{'\n'}e <Destaque>comece agora</Destaque>
              </Titulo>
              <Paragrafo>Leva menos de um minuto. Depois é só entrar e organizar suas tarefas do seu jeito.</Paragrafo>
              <View style={s.lista}>
                {BENEFICIOS.map((b, i) => (
                  <View key={b.titulo} style={[s.item, i > 0 ? s.itemSeparado : null]}>
                    <View style={s.itemIcone}>
                      <Icone nome={b.icone} tamanho={16} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.itemTitulo}>{b.titulo}</Text>
                      <Text style={s.itemTexto}>{b.texto}</Text>
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
            {!compacto ? <Text style={s.h1}>Crie sua conta</Text> : null}

            <CampoIcone
              icone={iconeDoNome(nome)}
              placeholder="Digite seu Nome"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
              value={nome}
              onChangeText={(t) => { setNome(t); limpar('nome'); }}
              erro={erros.nome}
            />
            <CampoIcone
              ref={emailRef}
              icone="envelope"
              placeholder="Digite seu Email"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => senhaRef.current && senhaRef.current.focus()}
              value={email}
              onChangeText={(t) => { setEmail(t); limpar('email'); }}
              erro={erros.email}
            />
            <CampoIcone
              ref={senhaRef}
              senha
              placeholder="Digite uma senha"
              autoComplete="new-password"
              textContentType="newPassword"
              passwordRules={REGRAS_IOS}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => confirmarRef.current && confirmarRef.current.focus()}
              value={senha}
              onChangeText={(t) => { setSenha(t); limpar('senha'); }}
              erro={erros.senha}
            />

            {senha.length > 0 ? (
              <View style={{ marginTop: -4, marginBottom: 10 }}>
                {regrasSenha(senha).map((r) => (
                  <View key={r.texto} style={s.requisito}>
                    <Icone nome={r.ok ? 'circle-check' : 'circle-xmark'} tamanho={13} cor={r.ok ? '#22c55e' : '#777777'} />
                    <Text style={[s.requisitoTxt, r.ok ? { color: '#22c55e' } : null]}>{r.texto}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <CampoIcone
              ref={confirmarRef}
              senha
              placeholder="Confirme sua senha"
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={enviar}
              value={confirmar}
              onChangeText={(t) => { setConfirmar(t); limpar('confirmar'); }}
              aviso={barraForca}
              dica={dicaConfirmar}
              erro={erros.confirmar}
            />

            <View style={{ marginTop: 10 }}>
              <Checkbox
                marcado={termos}
                onChange={(v) => { setTermos(v); limpar('termos'); }}
                tamanho={17}
                rotuloClicavel={false}
                style={{ alignItems: 'flex-start', gap: 9 }}
                caixaStyle={{ marginTop: 2 }}
              >
                <Text style={s.termosTxt}>
                  Li e aceito os{' '}
                  <Text style={s.termosLink} onPress={() => setModal('termos')}>Termos e Condições</Text>
                  {' '}e a{' '}
                  <Text style={s.termosLink} onPress={() => setModal('privacidade')}>Políticas de Privacidade</Text>
                </Text>
              </Checkbox>
            </View>
            <Text style={s.erroTermos}>{erros.termos ? `⚠ ${erros.termos}` : ' '}</Text>

            <BotaoPrincipal titulo="Cria Conta" onPress={enviar} desabilitado={!!estado} />

            <View style={s.registro}>
              <Text style={s.registroTxt}>Já possui uma conta?</Text>
              <Pressable onPress={() => navigation.navigate('Login')} hitSlop={AREA_TOQUE} style={{ paddingVertical: 6 }}>
                <Text style={s.registroLink}>Entrar na Minha Conta</Text>
              </Pressable>
            </View>
          </>
        )}
      </AuthLayout>

      <OverlayEstado
        tipo={estado}
        titulo={estado === 'sucesso' ? 'Conta criada com sucesso!' : 'Criando sua conta...'}
        subtitulo="Você será direcionado para o login."
      />

      <ModalTexto
        visivel={modal === 'termos'}
        onFechar={() => setModal(null)}
        icone="file-contract"
        titulo="Termos e Condições"
        intro="Ao criar uma conta, você concorda em utilizar nossa plataforma de forma responsável e de acordo com as regras estabelecidas."
        secoes={[
          { titulo: 'Uso da Plataforma', texto: 'O usuário é responsável pelas informações fornecidas durante o cadastro e pelo uso de sua conta.' },
          { titulo: 'Segurança', texto: 'Recomendamos que você mantenha sua senha segura e não compartilhe seus dados de acesso com outras pessoas.' },
        ]}
      />
      <ModalTexto
        visivel={modal === 'privacidade'}
        onFechar={() => setModal(null)}
        icone="shield-halved"
        titulo="Política de Privacidade"
        intro="Prezamos pela privacidade e segurança das informações fornecidas pelos usuários durante a utilização da plataforma."
        secoes={[
          { titulo: 'Dados pessoais', texto: 'As informações fornecidas no cadastro devem ser utilizadas apenas para as finalidades relacionadas ao funcionamento da plataforma.' },
          { titulo: 'Proteção', texto: 'Recomendamos que o usuário mantenha seus dados de acesso protegidos e não compartilhe sua senha.' },
        ]}
      />
    </>
  );
}

const s = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: '700', color: '#ffffff', marginBottom: 25 },
  lista: { width: '100%', maxWidth: 340 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  itemSeparado: { marginTop: 18, paddingTop: 18, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)' },
  itemIcone: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#1597ff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1597ff', shadowOpacity: 0.45, shadowRadius: 9, shadowOffset: { width: 0, height: 0 },
  },
  itemTitulo: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginBottom: 3 },
  itemTexto: { color: '#c4d8f5', fontSize: 13, lineHeight: 19 },
  requisito: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  requisitoTxt: { color: '#777777', fontSize: 13 },
  forcaTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  forcaRotulo: { color: '#777777', fontSize: 13 },
  barra: { width: '100%', height: 7, backgroundColor: '#e5e7eb', borderRadius: 10, overflow: 'hidden' },
  termosTxt: { color: '#c4d2e7', fontSize: 13, lineHeight: 19 },
  termosLink: { color: '#20a4ff', fontWeight: '700' },
  erroTermos: { color: '#d93025', fontSize: 13, marginTop: 8, marginBottom: 15, minHeight: 16 },
  registro: { alignItems: 'center', marginTop: 20 },
  registroTxt: { color: '#8fa4c1', fontSize: 14 },
  registroLink: { color: '#319cff', fontWeight: '700', fontSize: 16 },
});
