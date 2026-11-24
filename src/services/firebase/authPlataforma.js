// Versão celular (Android/iOS).
// A sessão sempre fica salva no AsyncStorage (ver config.js), como em qualquer app.
// O login com Google é feito pelo próprio Android (conta do aparelho), que devolve um
// idToken; o Firebase troca esse token por uma sessão — o mesmo usuário do site.
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './config';

// "ID do cliente da Web" do Firebase (Authentication > Google). Não é segredo.
const WEB_CLIENT_ID = '441811884875-1phjiv517op7bsoa7fc5hjn7qcrif3gd.apps.googleusercontent.com';

// Expo Go não tem o código nativo do Google: lá os botões ficam escondidos.
// iOS precisa de conta Apple paga + ID de cliente iOS; por enquanto, só Android.
const rodandoNoExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
export const googleDisponivel = Platform.OS === 'android' && !rodandoNoExpoGo;

const erroComCodigo = (code, mensagem = code) => Object.assign(new Error(mensagem), { code });

// Carregado só quando alguém toca no botão: importar no topo do arquivo
// derrubaria o app no Expo Go, onde o módulo nativo não existe.
let moduloGoogle = null;
function carregarGoogleSignin() {
  if (!moduloGoogle) {
    moduloGoogle = require('@react-native-google-signin/google-signin');
    moduloGoogle.GoogleSignin.configure({ webClientId: WEB_CLIENT_ID });
  }
  return moduloGoogle;
}

export async function definirPersistencia() {}

export async function autenticarComGoogle() {
  if (!googleDisponivel) {
    throw erroComCodigo('auth/operation-not-supported-in-this-environment');
  }
  const { GoogleSignin, isErrorWithCode, statusCodes } = carregarGoogleSignin();

  let resposta;
  try {
    await GoogleSignin.hasPlayServices();
    resposta = await GoogleSignin.signIn({});
  } catch (e) {
    if (isErrorWithCode(e) && e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw erroComCodigo('google/play-services-indisponivel');
    }
    if (isErrorWithCode(e) && e.code === statusCodes.IN_PROGRESS) {
      throw erroComCodigo('google/cancelado');
    }
    console.warn('Erro do Google Sign-In (código 10 = SHA-1 ou google-services.json):', e);
    throw e;
  }

  if (resposta.type !== 'success') throw erroComCodigo('google/cancelado');
  if (!resposta.data.idToken) throw erroComCodigo('google/sem-token');

  const credencial = GoogleAuthProvider.credential(resposta.data.idToken);
  const { user } = await signInWithCredential(auth, credencial);
  return user;
}

// Sem isto, o Google lembraria a última conta e não deixaria escolher outra no próximo login
export async function encerrarSessaoGoogle() {
  if (!moduloGoogle) return;
  await moduloGoogle.GoogleSignin.signOut().catch(() => {});
}
