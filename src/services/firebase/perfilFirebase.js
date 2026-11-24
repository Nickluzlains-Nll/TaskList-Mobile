// Perfil em usuarios/{uid}/dados/perfil  ->  { displayName, photo }  (igual ao site)
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from './config';
import { comTimeout } from './util';

const ref = (uid) => doc(db, 'usuarios', uid, 'dados', 'perfil');

export async function obterPerfil(uid) {
  try {
    const snap = await getDoc(ref(uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.warn('Não foi possível ler o perfil:', e);
    return null;
  }
}

// Tempo real: mudou nome/foto no site, muda aqui
export function observarPerfil(uid, callback, onErro) {
  return onSnapshot(
    ref(uid),
    (snap) => callback(snap.exists() ? snap.data() : null),
    (e) => {
      console.warn('Erro ao ler o perfil:', e);
      if (onErro) onErro(e);
    },
  );
}

export async function salvarPerfil(uid, perfil) {
  await comTimeout(setDoc(ref(uid), { displayName: perfil.displayName, photo: perfil.photo || '' }));
  if (auth.currentUser && auth.currentUser.displayName !== perfil.displayName) {
    updateProfile(auth.currentUser, { displayName: perfil.displayName }).catch(() => {});
  }
}
