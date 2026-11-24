// Mesmo projeto Firebase do site (task-list-8714f).
// A apiKey do Firebase NÃO é segredo: quem protege os dados são as regras do Firestore.
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCJ-fmEj_oLiIH0-WvYlWiWsvOeLLuiSPs',
  authDomain: 'task-list-8714f.firebaseapp.com',
  projectId: 'task-list-8714f',
  storageBucket: 'task-list-8714f.firebasestorage.app',
  messagingSenderId: '441811884875',
  appId: '1:441811884875:web:8a4e0590b94924533ce6ce',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Celular: guarda a sessão no AsyncStorage (senão o usuário teria que logar toda vez).
// Web do Expo: o getAuth() padrão já persiste no navegador.
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch (e) {
    // Fast Refresh: o auth já foi inicializado
    auth = getAuth(app);
  }
}
auth.languageCode = 'pt-BR'; // e-mails do Firebase em português

// Long polling automático evita travas de conexão do Firestore em alguns celulares/redes
let db;
try {
  db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
} catch (e) {
  db = getFirestore(app);
}

export { app, auth, db };
