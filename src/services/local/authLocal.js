// ⚠️ AUTENTICAÇÃO PROVISÓRIA, SÓ PARA DESENVOLVIMENTO.
// Guarda usuários no aparelho. Será SUBSTITUÍDA pelo Firebase Auth.
// Nunca guarde senha em texto puro num app de verdade.
import AsyncStorage from '@react-native-async-storage/async-storage';

const USUARIOS = 'taskflow:usuarios';
const SESSAO = 'taskflow:sessao';
const ouvintes = new Set();

const gerarId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const erro = (code) => Object.assign(new Error(code), { code });

async function lerUsuarios() {
  const bruto = await AsyncStorage.getItem(USUARIOS);
  return bruto ? JSON.parse(bruto) : [];
}

function publico(u) {
  return u ? { uid: u.uid, nome: u.nome, email: u.email } : null;
}

function avisar(usuario) {
  ouvintes.forEach((cb) => cb(usuario));
}

// Equivalente ao onAuthStateChanged do Firebase
export function observarAuth(callback) {
  ouvintes.add(callback);
  AsyncStorage.getItem(SESSAO).then(async (uid) => {
    if (!uid) return callback(null);
    const usuarios = await lerUsuarios();
    callback(publico(usuarios.find((u) => u.uid === uid)));
  });
  return () => ouvintes.delete(callback);
}

export async function registrar({ nome, email, senha }) {
  const usuarios = await lerUsuarios();
  const emailNorm = email.trim().toLowerCase();
  if (usuarios.some((u) => u.email === emailNorm)) throw erro('auth/email-already-in-use');
  const novo = { uid: gerarId(), nome: nome.trim(), email: emailNorm, senha };
  await AsyncStorage.setItem(USUARIOS, JSON.stringify([...usuarios, novo]));
  // Não inicia sessão: como no site, depois do cadastro o usuário vai para o login.
  // (Com o Firebase, createUserWithEmailAndPassword já loga; aí chamamos signOut em seguida.)
}

export async function entrar({ email, senha }) {
  const usuarios = await lerUsuarios();
  const emailNorm = email.trim().toLowerCase();
  const usuario = usuarios.find((u) => u.email === emailNorm && u.senha === senha);
  if (!usuario) throw erro('auth/invalid-credential');
  await AsyncStorage.setItem(SESSAO, usuario.uid);
  avisar(publico(usuario));
}

export const googleDisponivel = false;

export async function entrarComGoogle() {
  throw erro('auth/operation-not-supported-in-this-environment');
}

export async function sair() {
  await AsyncStorage.removeItem(SESSAO);
  avisar(null);
}

export async function recuperarSenha() {
  // No Firebase: sendPasswordResetEmail(auth, email). Aqui não faz nada.
}
