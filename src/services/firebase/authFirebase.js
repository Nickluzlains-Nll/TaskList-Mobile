// Autenticação real (Firebase Auth) — mesmas funções do authLocal.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { comTimeout } from './util';
import { definirPersistencia, autenticarComGoogle, encerrarSessaoGoogle } from './authPlataforma';

export { googleDisponivel } from './authPlataforma';

// O createUserWithEmailAndPassword já deixa a pessoa logada. Como no site, depois do
// cadastro ela vai para o login: durante o registro escondemos esse login "temporário"
// das telas (senão o app pularia para a Home e a tela de cadastro sumiria no meio).
let registrando = false;

const publico = (u) => (u ? { uid: u.uid, nome: u.displayName || '', email: u.email || '' } : null);

const documentoUsuario = (uid) => doc(db, 'usuarios', uid);

export function observarAuth(callback) {
  return onAuthStateChanged(auth, (u) => {
    if (registrando) return;
    callback(publico(u));
  });
}

export async function registrar({ nome, email, senha }) {
  registrando = true;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
    try {
      await updateProfile(cred.user, { displayName: nome.trim() });
      // Mesmo documento que o site cria no cadastro
      await comTimeout(setDoc(documentoUsuario(cred.user.uid), {
        nome: nome.trim(),
        email: email.trim(),
        criadoEm: serverTimestamp(),
      }));
    } catch (e) {
      // A conta já existe no Auth; não faz sentido mostrar "erro no cadastro"
      console.warn('Conta criada, mas falhou ao salvar o perfil:', e);
    }
    await signOut(auth);
  } finally {
    registrando = false;
  }
}

export async function entrar({ email, senha, lembrar = true }) {
  await definirPersistencia(lembrar);
  await signInWithEmailAndPassword(auth, email.trim(), senha);
}

export async function entrarComGoogle({ lembrar = true } = {}) {
  await definirPersistencia(lembrar);
  const usuario = await autenticarComGoogle();

  // Primeiro acesso com Google: cria o documento do usuário (mesma estrutura do cadastro)
  try {
    const existente = await getDoc(documentoUsuario(usuario.uid));
    if (!existente.exists()) {
      await comTimeout(setDoc(documentoUsuario(usuario.uid), {
        nome: usuario.displayName || '',
        email: usuario.email || '',
        criadoEm: serverTimestamp(),
      }));
    }
  } catch (e) {
    console.warn('Login ok, mas não foi possível salvar o usuário no Firestore:', e);
  }
}

export async function sair() {
  await encerrarSessaoGoogle();
  await signOut(auth);
}

// Só erros que a pessoa consegue resolver chegam à tela. Qualquer outro
// (inclusive e-mail inexistente) vira a mensagem genérica de sucesso,
// para não revelar quais e-mails têm conta — igual ao recuperar.js do site.
const ERROS_RECUPERACAO_VISIVEIS = ['auth/network-request-failed', 'auth/too-many-requests'];

export async function recuperarSenha(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (e) {
    if (ERROS_RECUPERACAO_VISIVEIS.includes(e.code)) throw e;
    console.warn('Erro ao enviar e-mail de recuperação:', e);
  }
}
