// Versão web (Expo web): as mesmas APIs que o login.js do site usa.
// O Metro escolhe este arquivo no navegador e o authPlataforma.js no celular,
// porque o build nativo do Firebase não tem signInWithPopup nem browserSessionPersistence.
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from './config';

export const googleDisponivel = true;

// "Lembrar" marcado = sessão fica salva; desmarcado = acaba ao fechar a aba
export function definirPersistencia(lembrar) {
  return setPersistence(auth, lembrar ? browserLocalPersistence : browserSessionPersistence);
}

export async function autenticarComGoogle() {
  const resultado = await signInWithPopup(auth, new GoogleAuthProvider());
  return resultado.user;
}

// No navegador o signOut do Firebase já basta: o popup sempre deixa escolher a conta
export async function encerrarSessaoGoogle() {}
